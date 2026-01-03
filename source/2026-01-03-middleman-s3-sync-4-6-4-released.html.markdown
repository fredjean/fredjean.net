---
title: "middleman-s3_sync 4.6.4 released"
date: 2026-01-03 10:00 -0700
tags: middleman, ruby, s3
---

I've just released version 4.6.4 of [middleman-s3_sync](https://github.com/fredjean/middleman-s3_sync), a gem that synchronizes Middleman-built websites to Amazon S3.

This release completely removes the `map` gem dependency and replaces it with a native Ruby implementation.

## Background

The [map gem](https://github.com/ahoward/map) provides a string/symbol indifferent hash implementation. After being stable at version 6.6.0 for about a decade, the original author unexpectedly released version 8.x, which introduced breaking changes that caused installation failures.

While we temporarily locked the dependency to version 6.6.0 in [v4.6.3](https://fredjean.net/middleman-s3-sync-4-6-3-released), it became clear that relying on an unmaintained library was not a sustainable solution.

## What Changed

Version 4.6.4 introduces `IndifferentHash`, a simple native Ruby class that provides the same functionality as the map gem:

- String/symbol indifferent key access
- Dot notation for accessing values
- Zero external dependencies
- Fully tested with the existing test suite

The implementation is straightforward and maintainable, living entirely within the gem's codebase.

## Benefits

- **More stable**: No dependency on unmaintained external libraries
- **Fewer dependencies**: One less gem to install and manage
- **Better control**: The functionality is now part of the gem itself
- **No breaking changes**: The API remains exactly the same

## Upgrading

To upgrade to the latest version, update your Gemfile:

```ruby
gem 'middleman-s3_sync', '~> 4.6.4'
```

Then run:

```bash
bundle update middleman-s3_sync
```

This is a drop-in replacement with no breaking changes—your existing code will continue to work exactly as before.

## Acknowledgments

Thanks to [Chad Wilson](https://github.com/chadlwilson) for identifying the issue in [PR #165](https://github.com/fredjean/middleman-s3_sync/pull/165) and proposing the initial workaround.

As always, the source code is available on [GitHub](https://github.com/fredjean/middleman-s3_sync), and the gem is available on [RubyGems](https://rubygems.org/gems/middleman-s3_sync).

