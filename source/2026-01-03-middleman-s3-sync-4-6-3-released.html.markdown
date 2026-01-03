---
title: "middleman-s3_sync 4.6.3 released"
date: 2026-01-03 09:34 -0700
tags: middleman, ruby, s3
---

I've just released version 4.6.3 of [middleman-s3_sync](https://github.com/fredjean/middleman-s3_sync), a gem that synchronizes Middleman-built websites to Amazon S3.

This is a maintenance release that addresses a dependency issue. Thanks to [Chad Wilson](https://github.com/chadlwilson) for identifying and fixing the problem in [PR #165](https://github.com/fredjean/middleman-s3_sync/pull/165).

## What Changed

The `map` gem, a dependency of middleman-s3_sync, had been stable at version 6.6.0 for about a decade. Recently, Ara unexpectedly released version 8.x, which introduced breaking changes that caused installation failures.

This release locks the `map` dependency to version 6.6.0 to ensure stable installations until the compatibility issues with the newer version can be resolved.

## Upgrading

To upgrade to the latest version, update your Gemfile:

```ruby
gem 'middleman-s3_sync', '~> 4.6.3'
```

Then run:

```bash
bundle update middleman-s3_sync
```

As always, the source code is available on [GitHub](https://github.com/fredjean/middleman-s3_sync), and the gem is available on [RubyGems](https://rubygems.org/gems/middleman-s3_sync).

