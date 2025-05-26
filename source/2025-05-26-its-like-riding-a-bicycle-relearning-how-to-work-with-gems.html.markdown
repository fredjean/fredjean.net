---
title: "It's like riding a bicycle: relearning how to work with Gems"
date: 2025-05-26 13:51 -0600
tags:
  - ruby
  - gems
  - amazon
  - tooling
---

They say it's like riding a bicycle - once you learn, you never forget. But after nearly 8 years at Amazon, I'm discovering that muscle memory can get pretty rusty when it comes to Ruby gems and the broader open source ecosystem.

Don't get me wrong - Amazon's internal tooling is impressive. When you're building systems at AWS scale, you need tools that can handle the complexity, the security requirements, and the operational rigor that comes with serving millions of customers. Internal package managers, build systems, and deployment pipelines are all optimized for that environment. They work incredibly well for what they're designed to do.

But stepping back into the world of `bundle install` and `gem update` feels... different. Foreign, almost.

## The Small Frictions Add Up

It started with something simple - updating this very blog. The `middleman-s3_sync` gem I wrote years ago needed some attention. What should have been a quick `bundle update` turned into an afternoon of reacquainting myself with dependency resolution, version constraints, and the subtle art of Gemfile management.

Inside Amazon, dependency management is largely abstracted away. The build systems handle most of the complexity, and when they don't, there are teams of people whose job it is to resolve conflicts and ensure compatibility. You focus on your business logic, not on whether your JSON parsing library plays nicely with someone else's HTTP client.

But in the gem ecosystem, you *are* that person. You're the one making decisions about semantic versioning, evaluating the trade-offs between features and stability, and sometimes diving into someone else's code to understand why your tests are failing after an update.

## The Muscle Memory Returns

The interesting thing is how quickly it comes back. After that first afternoon of frustration, I found myself falling back into familiar patterns. Reading changelogs with a critical eye. Understanding the implications of a major version bump. Appreciating the elegance of a well-crafted API.

There's something deeply satisfying about working with gems that embody the Ruby philosophy of developer happiness. The expressiveness, the focus on making common tasks simple, the assumption that you're a smart person who wants to get things done efficiently. It's a refreshing contrast to systems that assume you might break everything if given too much flexibility.

## Different Tools for Different Problems

This isn't a criticism of Amazon's approach - quite the opposite. When you're building infrastructure that needs to work reliably for millions of customers across dozens of regions, the constraints are different. The tooling reflects those constraints, and it should.

But working on personal projects reminds me why I fell in love with Ruby and its ecosystem in the first place. There's a joy in discovering a gem that solves exactly the problem you're facing. There's satisfaction in contributing back to projects that have made your life easier. There's learning that happens when you're forced to understand the full stack of your dependencies.

## The Value of Context Switching

Having worked in both worlds - the highly controlled internal ecosystem and the more chaotic but creative open source one - I'm grateful for the perspective it provides. Each approach has strengths that the other lacks.

Amazon's tooling taught me the value of consistency, reliability, and operational excellence at scale. The gem ecosystem reminds me of the power of community, the importance of developer experience, and the beauty of solving problems with elegant code.

## Moving Forward

As I continue to work on side projects and contribute back to the open source community, I'm trying to bring the best of both worlds together. The operational rigor I learned at Amazon, combined with the creative problem-solving and community spirit of the Ruby ecosystem.

It really is like riding a bicycle. The balance might feel shaky at first, but once you're moving, it all comes back. And sometimes, the ride is even better than you remembered.

---

*Have you experienced similar transitions between different tooling ecosystems? I'd love to hear about your experiences in the comments or [reach out directly](/contact).*