###
# Compass
###

require 'uglifier'
require 'active_support/core_ext/integer/time'
require 'active_support/core_ext/numeric/time'
require 'active_support/core_ext/date/calculations'
require 'active_support/core_ext/date_time/calculations'

###
# Page options, layouts, aliases and proxies
###

Time.zone = 'America/Denver'

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

set :partials_dir, 'partials'

###
# Helpers

###
helpers do
  def title
    if current_page.url == '/'
      "Out of my mind..."
    elsif title = current_page.data.title
      "#{title} | Out of my mind..."
    else
      "Out of my mind..."
    end
  end
end

require 'lib/tweet_helpers'
helpers TweetHelpers

activate :directory_indexes

# JavaScript is now handled directly without Sprockets
# contact-form.js content is copied into all.js

# Improving cacheability
activate :asset_hash

# Automatic image dimensions on image_tag helper
activate :automatic_image_sizes

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

# Configure Sass to compile and compress CSS
set :sass, style: :compressed

page '/404.html'

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # Note: minify_css disabled due to conflict with github.css.scss import
  # activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript, compressor: -> { Uglifier.new(harmony: true) }
  activate :minify_html
  activate :gzip
end

set :markdown_engine, :redcarpet
set :markdown,  :fenced_code_blocks => true,
                :autolink => true,
                :smartypants => true

activate :blog do |blog|
  blog.prefix = ""
  blog.permalink = ":title"
  blog.paginate = true
  blog.layout = 'post'
  blog.default_extension = ".markdown"
  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"
end

page "/feed.xml", :layout => false

activate :s3_sync do |sync|
  sync.bucket = 'fredjean.net-website'
  sync.region = 'us-east-1'
  sync.acl = '' # Bucket has ACLs disabled, using OAC for CloudFront
  sync.prefer_gzip = true
  sync.version_bucket = true
  sync.content_types = {
    "test.me" => "text/plain",
    ".css" => "text/css",
    ".js" => "application/javascript"
  }
  sync.cloudfront_invalidate = true
  sync.cloudfront_distribution_id = 'E2X56J66W6KC7E'
  sync.cloudfront_invalidation_max_retries = 5
  sync.cloudfront_invalidation_batch_delay = 5
end

caching_policy 'image/png', max_age: 12.months, expires: 12.months.from_now
caching_policy 'image/jpeg', max_age: 12.months, expires: 12.months.from_now
caching_policy 'text/css', max_age: 12.months, expires: 12.months.from_now
caching_policy 'application/javascript', max_age: 12.months, expires: 12.months.from_now

activate :syntax, line_numbers: true
