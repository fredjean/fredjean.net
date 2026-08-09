require 'erb'

module BlogHelpers
  ROMAN_NUMERALS = {
    1000 => 'M', 900 => 'CM', 500 => 'D', 400 => 'CD',
    100 => 'C', 90 => 'XC', 50 => 'L', 40 => 'XL',
    10 => 'X', 9 => 'IX', 5 => 'V', 4 => 'IV', 1 => 'I'
  }.freeze

  READING_WPM = 200

  # "N minute(s)", based on a 200wpm read over the plain-text article body.
  def reading_time(article)
    words = article.body.gsub(/<[^>]+>/, ' ').split.size
    minutes = [(words / READING_WPM.to_f).ceil, 1].max
    "#{minutes} minute#{'s' unless minutes == 1}"
  end

  def first_article_year
    blog.articles.map(&:date).min.year
  end

  # Roman numeral for how many years this blog has been running,
  # counted from the first article's year (2007 -> Vol. I in 2008, etc).
  def volume_numeral
    to_roman(Time.now.year - first_article_year)
  end

  # The volume number for a given year, or nil for the founding year itself.
  def volume_for_year(year)
    year > first_article_year ? to_roman(year - first_article_year) : nil
  end

  def to_roman(number)
    result = +''
    remaining = number
    ROMAN_NUMERALS.each do |value, numeral|
      count, remaining = remaining.divmod(value)
      result << (numeral * count)
    end
    result
  end

  # [[group_name, count], ..., ["Everything else", count]] driven by
  # data/back_issues.yml's `groups:` map. Each article counts toward at most
  # one group (its first match, same rule as article_kicker) so the counts
  # sum to the total article count instead of double-counting articles that
  # straddle two groups' tag lists; "Everything else" is what's left.
  def subject_groups
    groups_data = data.back_issues.groups
    counts = Hash.new(0)

    blog.articles.each do |article|
      match = groups_data.find { |_name, tags| (article.tags & tags).any? }
      counts[match.first] += 1 if match
    end

    groups = groups_data.keys.map { |name| [name, counts[name]] }
    groups << ['Everything else', blog.articles.size - counts.values.sum]
    groups
  end

  # The four curated back issues, resolved from data/back_issues.yml's
  # `picks:` slugs so titles/dates never go stale.
  def back_issues
    data.back_issues.picks.filter_map { |slug| blog.articles.find { |a| a.slug == slug } }
  end

  # The subject-group name an article belongs to (for use as its dateline
  # kicker), or "Journal" if it doesn't fall into any of the named groups.
  def article_kicker(article)
    match = data.back_issues.groups.find { |_name, tags| (article.tags & tags).any? }
    match ? match.first : 'Journal'
  end

  # [[year, count], ...] newest first, for the "By volume" rail index.
  def by_year_counts
    blog.articles.group_by { |a| a.date.year }
                 .transform_values(&:size)
                 .sort_by { |year, _count| -year }
  end

  # [[month_number, count], ...] for Jan..Dec of the given year, so months
  # with nothing published still show up (with a count of 0).
  def by_month_counts(year)
    articles_by_month = blog.articles.select { |a| a.date.year == year }
                             .group_by { |a| a.date.month }
    (1..12).map { |month| [month, articles_by_month.fetch(month, []).size] }
  end

  # Whether this is one of the middleman-s3_sync "X.Y.Z released" posts.
  def release_note?(article)
    article.tags.include?('middleman') && article.tags.include?('s3') && article.title =~ /released/i
  end

  # The release-note siblings for the article rail's "The release series"
  # block, newest first, capped so the list stays a rail-sized skim.
  def release_series(article, limit: 6)
    siblings = blog.articles.select { |a| release_note?(a) }.sort_by(&:date).reverse
    siblings.first(limit).include?(article) ? siblings.first(limit) : (siblings.first(limit - 1) + [article]).sort_by(&:date).reverse
  end

  # "4.8.0 — May 2026", pulled from the release note's version number and date.
  def release_title(article)
    version = article.title[/\d+\.\d+(?:\.\d+)?/] || article.title
    "#{version} &mdash; #{article.date.strftime('%b %Y')}".html_safe
  end

  # A plain-text (HTML-stripped) excerpt, for contexts like row descriptions
  # where the excerpt sits inside an inline element and can't hold markup.
  def plain_excerpt(article, characters: 160)
    return article.data['summary'] if article.data['summary']

    text = article.body.gsub(/<[^>]+>/, ' ').squeeze(' ').strip
    text.length > characters ? "#{text[0...characters].rstrip}&hellip;".html_safe : text
  end

  # The article's dateline standfirst: an explicit `standfirst:` front-matter
  # key if a post has one, otherwise a plain-text lead-in trimmed from the body.
  def standfirst(article)
    plain_excerpt(article, characters: 160)
  end

  # Extracts (short, one-line) use the `summary:` front-matter key verbatim
  # when a post has one. The lead excerpt is long enough that it should
  # still read as the article's own prose, not just repeat the one-liner, so
  # it always runs AutoExcerpt over the real body — code blocks included,
  # captioned the same as on the article page. (The lead shows the summary
  # too, as its own standfirst line above this excerpt — see index.html.erb.)
  SHORT_EXCERPT_THRESHOLD = 300

  def excerpt_for(article, characters:)
    if article.data['summary'] && characters <= SHORT_EXCERPT_THRESHOLD
      return "<p>#{ERB::Util.html_escape(article.data['summary'])}</p>".html_safe
    end

    inject_code_captions(AutoExcerpt.new(article.body, characters: characters))
  end

  # middleman-syntax/Rouge renders a fenced code block as
  # <div class="highlight"><pre class="highlight LANG">...</pre></div> with
  # no caption. Wrap each one in a <figure> with the small uppercase caption
  # row the design calls for (language on the right; filename needs a
  # helper Redcarpet doesn't give us, so the left side stays blank per
  # handoff §5 — "captionless blocks look fine").
  CODE_BLOCK_RE = %r{<div class="highlight"><pre class="highlight (?<lang>[\w+-]+)">.*?</pre></div>}m

  def inject_code_captions(html)
    html.gsub(CODE_BLOCK_RE) do |block|
      lang = Regexp.last_match(:lang)
      caption = %(<figcaption class="code-caption"><span></span><span>#{ERB::Util.html_escape(lang)}</span></figcaption>)
      "<figure class=\"code-figure\">#{caption}#{block}</figure>"
    end.html_safe
  end
end
