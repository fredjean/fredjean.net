---
title: Relaunching My Blog
date: 2013-04-15 14:37 MDT
tags: middleman, blog
---

I have left my blog dormant for about 3 years now. There aren't good
reasons or excuses to have done so. I just focussed my energies on other
activities and outlets (mainly [Twitter](http://twitter.com/fredjean)
and [Facebook](http://facebook.com/fredjean).

The upcoming demise of Posterous made me rethink how I wanted to host
and maintain my blog. The idea of being utterly dependent on a service
that may not be around for a while was a little unsettling. So I decided
to regain control of how my blog is authored, built and hosted.

We are using [Middleman](http://middlemanapp.com) at
[dojo4](http://dojo4.com) to build and maintain
static web sites for our clients. This has proven to be a powerful and
flexible way to quickly build small web site and work on larger ones as
well. It's ability to apply layouts to pages and to build data driven
sites has made it easy and pleasant to build data driven sites and
evolving the layout of a site without having to touch every single
pages.

Middleman happens to have a [blogging extension](http://middlemanapp.com/blogging/).
This extension gives you the tools needed to build and maintain a blog.
The layout feature and a small collection of helpers are comfortable and
familiar to individuals who work with Ruby on Rails on a daily basis.

Another nicety is that you can treat your blog just like you treat your
code. I am managing my site through
[GitHub](https://github.com/fredjean/fredjean.net). I just turned it
into a public repo for other individuals who may choose to follow the
same path.

The last piece of the puzzle is where to host the blog proper. In my
case, I am authoring a Ruby Gem called
[middleman-s3_sync](https://github.com/fredjean/middleman-s3_sync) whose
whole purpose is to push files to an S3 bucket. The bucket itself is
configured to expose it's content as a web site. I then used
[DNSimple.com](http://dnsimple.com) to point
[fredjean.net](http://fredjean.net) to the bucket.

The end result is a blogging environment that I control, build and
manage using tools that are familiar to me as a developer and leverages
cloud computing technologies.

Many thanks to [dojo4](http://dojo4.com) for allowing me to work on
enabling technologies and in particular to [Peter](http://www.dojo4.com/team/peter-mc-ewen)
for feedback on the design and [Steve](http://www.dojo4.com/team/steve-bailey)
for reminding me that I did indeed write [middleman-s3_sync](https://github.com/fredjean/middleman-s3_sync).
