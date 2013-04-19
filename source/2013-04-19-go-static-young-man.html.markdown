---
title: Go Static Young Man!
date: 2013-04-19 16:35 MDT
tags:
---

There are many options available for blog posting. There are SaaS
solutions where the blogging infrastructure is managed for you. There
are a few self-hosted solution where you (or your organization) is
managing the infrastructure of your blog. Either options usually
involved dynamic content that is assembled on request. There's really
nothing wrong with that model. It works well for many people.

It's not the only option though. Tim Bray publishes [his blog](http://www.tbray.org/ongoing/)
as the output of a series of Perl scripts. I chose to follow a similar
path for this blog.

The two main options that I considered for my blog migration were [Jekyll](https://github.com/mojombo/jekyll)
and [Middleman's blogging extension](http://middlemanapp.com/blogging).
Jekyll is getting a fair amount of support since it is easy to use
GitHub pages to host it. Middleman's blogging extension won out though
due to my involvement in the Middleman community. It made sense to use
my [middleman-s3_sync](https://github.com/fredjean/middleman-s3_sync)
gem to publish the blog to to an S3 bucket configured as a web site.

The biggest win for me is the high level of control over every single
aspects of my blog. I was able to retain the same URLs as my Posterous
based blog. I have full control over the layout, the mark up and design.

There are some trade offs though. You cannot use an embedded comment
system on the blog. This is where a comment system like
[Disqus](http://disqus.com) comes into play. Some measure of dynamic
behavior can be added back via JavaScript code.

I wouldn't go back to a hosted blogging platform though. Middleman's
blogging extension fits how my developer brain works and I am quite
happy with the results so far.
