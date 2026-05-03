---

title: "middleman-s3_sync 4.8.0 released"
date: 2026-05-03 16:00 -0600
tags: middleman, ruby, s3

---

I've just released version 4.8.0 of [middleman-s3_sync](https://github.com/fredjean/middleman-s3_sync), a gem that synchronizes Middleman-built websites to Amazon S3, with optional CloudFront invalidation. This release tightens the HTTP caching story for hashed assets.

## What's new

### `immutable` directive

Caching policies now support the `immutable` flag. Pair it with a long `max_age` on fingerprinted assets — the kind Middleman's `asset_hash` extension produces — and browsers will skip revalidation entirely, even on a user-initiated reload:

```ruby
caching_policy 'text/css',               max_age: 1.year, public: true, immutable: true
caching_policy 'application/javascript', max_age: 1.year, public: true, immutable: true
caching_policy 'image/png',              max_age: 1.year, public: true, immutable: true
caching_policy 'image/jpeg',             max_age: 1.year, public: true, immutable: true
```

Resulting header:

```
Cache-Control: max-age=31556952, public, immutable
```

This is the strongest cache hint you can give for content-addressed URLs. It's safe whenever the URL changes the moment the bytes change — exactly the contract `asset_hash` provides. I've turned it on for this blog.

### `max-age` now overrides `Expires`

When a policy sets `max_age:`, the `Expires` header is now suppressed — even if `expires:` is also configured. Per [RFC 7234 §5.3](https://www.rfc-editor.org/rfc/rfc7234#section-5.3), `max-age` takes precedence over `Expires` for HTTP/1.1 caches anyway, so emitting both adds no information. More importantly, it stops the `expires:` timestamp from drifting forward on every build, which used to force a metadata-only update on every cached object.

Configs that use `expires:` alone (without `max_age:`) continue to work unchanged.

If you currently have something like:

```ruby
caching_policy 'text/css', max_age: 12.months, expires: 12.months.from_now
```

The `expires:` argument is now redundant. You can drop it next time you touch the file.

### Tidier upload payloads

`Resource#to_h` and the streaming upload path no longer include empty `cache_control` or `expires` keys when the caching policy yields `nil` for them. Mostly invisible, but it keeps the AWS SDK request payload clean.

## Other Improvements

- **Ruby 3.1 CI**: dropped the `timerizer` development dependency. It monkey-patched `Time.new` in a way that's incompatible with Ruby 3.1.7's keyword-argument changes and crashed RSpec at startup on the 3.1 matrix. Three test usages were replaced with plain `Time` literals.

## Upgrading

Update your Gemfile:

```ruby
gem 'middleman-s3_sync', '~> 4.8'
```

Then run:

```bash
bundle update middleman-s3_sync
```

Adding `immutable: true` to your existing caching policies will trigger one re-upload per matching object the next time you sync — the new directive changes the `Cache-Control` string, which the metadata-match check correctly detects. Subsequent syncs settle back to the usual "no changes" pattern.

## Thanks

As always, the source is on [GitHub](https://github.com/fredjean/middleman-s3_sync) and the gem is on [RubyGems](https://rubygems.org/gems/middleman-s3_sync). Feedback and PRs welcome!
