---
title: PhantomJS and Poodles
date: 2014-10-20 10:13 MDT
tags: phantomjs,testing,poodle,ssl,paypal
---

![Poodle source:
https://secure.flickr.com/photos/imagesbywestfall/3452788638/in/photolist-6g7rLA-5Ly2TJ-dhgp22-7Eq65g-4L9Gkr-4L9Gkv-5MgFuL-86RKEk-a2Vhpv-54pS7t-uKNEz-2yMbx-7KkzPK-7BizcU-6fJFni-38DoTP-8smzb-rQXyi-fcDEVr-7b85h1-7Y7hwQ-dKEkPA-7AtcjM-keJ7tm-7NDCUj-dGSKFe-7kYDHP-8cXRa5-bKAgZ-5McrAk-6eCU2x-ijPiDn-9ycYtL-2rSBGq-7DRCHb-7Aniiq-7BiAts-dTdnGK-9wm9XC-dKEkb7-7tzuvX-7pSYi1-7uyoDN-dKyToP-7yA4oj-6x661Y-7nXHTq-7B9BnA-7zfV92-kSpeT/](images/poodle.jpg)

The client that I am working with runs a web store and needed some
changes made to the Spree/Paypal Express Checkout gateway to support
receiving addresses from Paypal. This involves a fair amount of
coordination between Paypal and Spree. It's also fairly mission
critical. This is the kind of code that requires a fair amount of
testing. It is also the kind of code that is best tested via
integration/acceptance level of testing.

We use Capybara and [PhantomJS](https://github.com/ariya/phantomjs) to drive the acceptance level tests.
PhantomJS is a great little headless browser that makes it very easy to
run acceptance tests on a CI server (or on a developer system).

The tests that interracted with Paypal's sandbox started to fail on
Friday. It turns out that PhantomJS [defaults to SSLv3](https://github.com/ariya/phantomjs/issues/12655) when connecting to a SSL enabled site. Paypal [had started to disable SSLv3 across their site](https://www.paypal-community.com/t5/PayPal-Forward/PayPal-Response-to-SSL-3-0-Vulnerability-aka-POODLE/ba-p/891829).

The good news is that there is an easy workaround to convince PhantomJS
to use TLSv1 when connecting to an SSL web site. All you need to do is
to add the following snippet to your ```spec/spec_helper.rb``` file:

```ruby
Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app,
      :phantomjs_options => ['--ssl-protocol=TLSv1'], :debug => false)
  end
end
```

At this point, the tests started to pass again.
