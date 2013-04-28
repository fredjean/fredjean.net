###
# Compass
###

# Susy grids in Compass
# First: gem install susy
require 'susy'

# Change Compass configuration
compass_config do |config|
  config.output_style = :compact
end

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

# Automatic image dimensions on image_tag helper
activate :automatic_image_sizes

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  require "middleman-smusher"
  activate :smusher
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

activate :directory_indexes
activate :asset_hash

activate :s3_sync do |sync|
  sync.bucket = 'fredjean.net'
  sync.region = 'us-east-1'
  sync.aws_access_key_id = ENV['AWS_ACCESS_KEY_ID']
  sync.aws_secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
  sync.delete = true
  sync.after_build = false
end

activate :syntax,
  :linenos => 'inline',
  :lineanchors => 'L',
  :anchorlinenos => true

