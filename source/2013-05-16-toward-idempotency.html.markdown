---
title: Toward Idempotency
date: 2013-05-16 11:31 MDT
tags:
---
<blockquote>
<dl>
<dt>Idempotent</dt>
<dd>
An idempotent operation is one where the result of the operation is the
same when it is repeated with the same input parameter.
</dd>
</dl>
</blockquote>

One of the design goals of my
[middleman-s3_gem](https://github.com/fredjean/middleman-s3_sync) gem is
to only push content that has been updated to an S3 bucket. This was
achieved initially by comparing the MD5 digest of the results of
the ```middleman build``` against the MD5 digest of the existing files
in the target S3 bucket. Files that had a different MD5 digest were then
pushed to the server.

This worked great for a while. I was able to reduce the impact of
pushing content to a web site, which made [dojo4's](http://dojo4.com)
frontend developers quite happy.

Another goal of the middleman-s3-sync gem is that an otherwise
identical resource built on different systems should be recognized as
being identical and not pushed to S3 if it was up to date (the digests
matched).

Something strange happened as I was testing the gem after adding support
for gzip compressed resources.

I was able to build this blog and push it
to S3. Doing it again would result in an empty change set, which is the
desired effect. Rebuilding it again and pushing the site again also
resulted in an empty change set since Middleman itself does it's best to
avoid updating files that didn't change.

However, deleting the build directory and rebuilding the site again resulted in a
push of all the compressed files back to the server.

Further more, building the same site on [Travis CI](https://travis-ci.org/fredjean/fredjean.net) also
resulted in the compressed files being pushed to S3.

This surprised me. I expected that the middleman build would have
generated identical sites from the same source input. After all, this is
something that we come to expect from compilers and build scripts. The
result of a build should be idempotent.

I started to explore different theories on what might be going on. The
detail that only the compressed files were affected was a strong clue
that it had something to do with compression. I eventually learned that
[a file's modification time is stored in the gzipped file's metadata](http://www.dotnetperls.com/gzip-header). Deleting
the build directory and rebuilding it generated new modification times.
The same occured when the build occured on a different machine. Each
clean build generated a new and differnet gzip file. Middleman-s3_sync
did exactly what it was supposed to do in this case and pushed the file.

The fix was to compute the digest of the original, non-compressed file
against a previous run that was stored as custom metadata on the S3
object. This restored the desired behavior of the gem and also prevents
a failure mode when an S3 object's etag isn't the MD5 digest of the
resource.

Of course, this also exposed a few situations where the result of the
```middleman build``` command was different on my laptop and on Travis.
I'm slowly finding them and resolving them so this blog can keep being a
really good test case of the gem itself.
