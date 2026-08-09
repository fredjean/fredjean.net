---

title: "middleman-s3_sync 4.6.5 released"
date: 2026-02-15 16:29 -0700
tags: middleman, ruby, s3
summary: "Thread-safe CloudFront invalidation tracking, batched S3 deletes, and streaming uploads — efficiency and stability work for larger syncs."

---

I've just released version 4.6.5 of [middleman-s3_sync](https://github.com/fredjean/middleman-s3_sync), a gem that synchronizes Middleman-built websites to Amazon S3, with optional CloudFront invalidation.

## Highlights

- Thread-safe CloudFront invalidation path tracking (use Set + mutex) when running in parallel
- Cache CloudFront client for fewer re-instantiations (with a reset helper for tests)
- Single-pass resource categorization to reduce repeated scans
- Batch S3 deletes with `delete_objects` (up to 1000 keys per request)
- Stream uploads to S3 for lower memory usage; compute MD5s in a single read when possible
- Faster CloudFront redundant-path pruning (O(n × path_depth))
- CLI/extension now delegates option writers (e.g., `verbose=`, `dry_run=`) to avoid `NoMethodError`

These changes preserve default behavior but should improve efficiency and stability—especially on larger syncs with many deletes/invalidations or large assets.

## Upgrading

Update your Gemfile to track any `4.6.x` release:

```ruby
gem 'middleman-s3_sync', '~> 4.6'
```

Then run:

```bash
bundle update middleman-s3_sync
```

## Performance note

On my blog (light update set), wall time was essentially unchanged (≈7.7s new vs ≈7.7s old). The benefits primarily appear on larger deployments, where batching, single-pass categorization, and streaming help more.

## Thanks

As always, the source is on [GitHub](https://github.com/fredjean/middleman-s3_sync) and the gem is on [RubyGems](https://rubygems.org/gems/middleman-s3_sync). Feedback and PRs welcome!
