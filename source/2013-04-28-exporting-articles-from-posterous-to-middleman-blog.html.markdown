---
title: Exporting Articles from Posterous to Middleman Blog
date: 2013-04-28 09:52 MDT
tags:
---

Posterous is about to shut down access to the web site. They do provide
a facility to [backup your space's content](http://posterous.com/#backup). It works.
You end up with a zip file with your whole content and what appears to
be a Wordpress export file. It wasn't quite ready to import into my new
Middleman based blog though.

It turns out that [Jekyll](https://github.com/mojombo/jekyll) has a few
exporters, including one for [Posterous](https://github.com/mojombo/jekyll/wiki/Blog-Migrations#posterous)!

The first step was to install Jekyll:

```shell
gem install jekyll
```

And then export my content:


```shell
ruby -rubygems -e 'require "jekyll/migrators/posterous"; Jekyll::Posterous.process("fred@fredjean.net", "NotMyPassword", "NotMyKey")'
```

It exported all of my content into a _post directory. I copied it into
my newly initialized blog under the ```source``` directory and went to
work styling the blog.

A nice feature of the Jekyll exporter was that the articles already had
front-matter that was compatible with Middleman! It included a layout
declaration. I created a layout matching the name for the article and
was able to use my content with little, if any, modifications.
Middleman's wrapped layouts made this a breeze:

```ruby
<% wrap_layout :layout do %>
<article>
  <h1><%= current_page.data.title %></h1>
  <%= yield %>
</article>
<% end %>
```

