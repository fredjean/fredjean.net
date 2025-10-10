# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a personal blog built with Middleman, a Ruby-based static site generator. The site is hosted on AWS S3 with CloudFront distribution and deploys via automated synchronization.

## Getting Started

### Initial Setup
- `mise run setup` - Install dependencies and generate binstubs (recommended first step)
- `mise install` - Install required Ruby version (3.4.2) if not already available

### Alternative Manual Setup
- `bundle install` - Install Ruby dependencies
- `bundle binstubs --all` - Generate binstubs for faster command execution

## Common Development Commands

### Local Development
- `bundle exec middleman server` - Start development server (usually on http://localhost:4567)
- `bundle exec middleman console` - Start interactive console for debugging

### Content Creation
- `bundle exec middleman article "Post Title"` - Create a new blog post with proper frontmatter
- Blog posts are created in the `source/` directory with `.html.markdown` extension

### Building and Deployment
- `bundle exec middleman build --clean` - Build static site to `build/` directory
- `rake build` - Alternative build command (also sets encoding)
- `bundle exec middleman s3_sync` - Deploy to S3 bucket
- `rake sync` - Deploy using Rake task
- `rake` or `rake default` - Build and deploy in one command
- `bundle exec middleman invalidate` - Invalidate CloudFront cache
- `rake invalidate` - Invalidate CloudFront using Rake

### Code Quality
- `bundle exec rubocop` - Run Ruby linter (configured in Gemfile)
- `bundle exec solargraph` - Ruby language server for IDE support

## Architecture Overview

### Middleman Configuration
The site uses Middleman 4.x with several key extensions:
- **middleman-blog**: Core blogging functionality with pagination
- **middleman-s3_sync**: Custom fork for AWS S3 deployment with CloudFront invalidation
- **middleman-syntax**: Code syntax highlighting with line numbers
- **middleman-minify-html**: HTML minification for production builds

### Directory Structure
```
source/
├── layouts/          # ERB templates
│   ├── layout.erb    # Main site layout with sidebar and navigation
│   └── post.erb      # Blog post wrapper with Disqus comments
├── partials/         # Reusable template components
│   └── _byline.html.erb  # Post metadata and byline
├── stylesheets/      # CSS assets
│   ├── all.css.scss  # Main stylesheet (Susy grid system)
│   ├── solarized.css # Syntax highlighting theme
│   └── normalize.css # CSS reset
└── [year-month-day-title.html.markdown]  # Blog posts
```

### Key Configuration Details
- **Permalink structure**: `:title` (no date in URLs)
- **Blog prefix**: "" (posts at root level)
- **Pagination**: Enabled with 10 posts per page
- **Markdown engine**: Redcarpet with fenced code blocks, autolink, and smartypants
- **Asset optimization**: CSS/JS minification, asset hashing, gzip compression
- **Deployment**: S3 bucket 'fredjean.net-website' in us-east-1 with CloudFront distribution

### Custom Helpers and Extensions
- `TweetHelpers` module in `lib/tweet_helpers.rb` for embedding tweets via Twitter oEmbed API
- Custom `title` helper for dynamic page titles
- Susy grid system for responsive layout
- Asset hash fingerprinting for cache busting

### Template System
- **Main layout**: Includes sidebar navigation, Google Analytics, Pingdom RUM monitoring
- **Post layout**: Wraps articles with Disqus comment system
- **Index page**: Shows recent posts with excerpts (250 characters) and pagination
- **Partials**: Modular components for consistent post metadata display

### Deployment Pipeline

#### GitHub Actions (Current)
The site now deploys automatically via GitHub Actions when pushing to the `master` branch:

1. **Trigger**: Push to `master` branch
2. **Build**: GitHub Actions runs `bundle exec middleman build --clean`
3. **Deploy**: Syncs to S3 using `bundle exec middleman s3_sync`
4. **Invalidate**: CloudFront cache invalidation via `bundle exec middleman invalidate`
5. **Authentication**: Uses OIDC with AWS IAM role for secure, keyless deployment

#### Migration from Travis CI
This project was migrated from Travis CI to GitHub Actions in 2024:

**Changes made:**
- Removed `.travis.yml` configuration
- Added `.github/workflows/deploy.yml` with GitHub Actions workflow
- Created AWS IAM role `GitHubActionsRole` with OIDC trust relationship
- Updated IAM policies to use account ID `374317007405`
- Configured GitHub repository secret `AWS_ROLE_ARN`

**Benefits of GitHub Actions:**
- Native GitHub integration (no external service)
- OIDC authentication (no long-lived AWS keys)
- Faster deployment pipeline
- Better integration with GitHub's ecosystem

#### Technical Details
1. Build process minifies CSS/JS and optimizes assets
2. S3 sync uploads files with proper cache headers (12 months for images/assets)
3. CloudFront invalidation ensures fresh content delivery
4. Gzip compression for all text assets

### Content Management
- Posts use Markdown with YAML frontmatter
- Syntax highlighting with Solarized theme
- Automatic excerpt generation for index pages
- Tag and calendar archive functionality available
- RSS feed generation at `/feed.xml`