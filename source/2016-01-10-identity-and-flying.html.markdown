---
title: Identity and Flying
date: 2016-01-10 14:19 MST
tags:
---

![Airport Security. Public Domain, https://www.flickr.com/photos/sixmilliondollardan/3382932556/in/photolist-69WpZo-6ovssq-4Pud5x-3yTksP-BMEB-6jdHz1-4vGox9-e8WbBd-Eq1JM-4u6cXw-f49kST-9yMyqh-2mPphB-7tQfFt-7zd55c-a6UnD2-4MZHTA-8G8fAm-8iDGiZ-b2hbhp-b636x-661hXd-459nE-acE949-kQFt6-53B2Fg-EMBoQ-b5awD-8SNYPd-8U8gQ7-6EsPiP-5YKWV9-nXRXdD-5NpqpQ-6jq1w-4FZCDR-b5axC-8UYf8L-AHptGi-5MF1mL-vBhvH-e3zcE-eNmLN9-58Vjve-96E2cA-6unyV7-7qNu4W-5588mk-bXavMg-ggg1g](/2016-01-10-identity-and-flying/airport_security.jpg)

Authentication and authorization are two concepts that are often mingled
together. In a lot of Rails app, there is little though given to it
beyond adding `devise` to an app and running the generator to build the
User model. In Spring based app, including Spring Security with a
minimal configuration is often all of the security you need.

Both concepts are separate though. You can authenticate a user or a
client without necessarily authorizing it. Authentication is merely
establishing the identity of the other party involved in an interaction.
Authorization may range from scoping the data that a user can see to
implementing complex business rules around what the same user can see.

It may make it easier to think about these two topics by discussing what
you need to do in order to get to your seat on a plane. This is fresh on
my mind as I just came back from a Mexican vacation and am on my way to
Los Angeles for a business trip.

You need two separate documents to get through airport security in the
United States.

The first document is a state issued identification. This
could be a driver's license, a passport or a permanent resident card.
This document asserts your identity. It is your authentication. It is
not sufficient to get you through security though.

In itself, it is not sufficient to gain access to your gate though. A
second document is required. This second document is your boarding pass.
The boarding pass asserts that you are authorized to access a specific
seat on a specific airplane. It is your authorization. In itself, it is
not sufficient to get you through airport security either.

Once you passed security, your boarding pass is usually sufficient to
your gate and to your flight for domestic flights in the United States.

OAuth2 is described as an authorization document. It is a protocol where
you receives access and refresh tokens in exchange for some form or
identity (and authorizing a service to access your information). The
access token itself doesn't imply authentication. A third party may use
it to retrieve identity information from the provider, but it just state
that the service or application presenting the token is authorized to
access certain resources from the issuer.

Of course, your boarding pass does carry some identity information. This
is usually your name, but it may include other identifiers such as your
frequent flier miles. The barcode on the boarding pass may even be
signed in order to verify the identity of the issuer and that the bar
code has not be tempered with.

The equivalent in the OAuth2 world are [JSON Web Tokens](http://jwt.io) (JWT). A JWT is a
small JSON document that has been signed by the issuer. It is a
document that can be validated by either a shared secret or a public
key without having to send the actual token back to the issuer. The JWT
usually carries an identifier (the subject) as well as information on
who issued the token (the issuer). It still doesn't imply
authentication, but it can be passed around to establish an
authorization context.

JWTs shine in distributed and micro-services architecture as they can be
validated at the edge and passed around from micro-service to
micro-service to establish the authorization context using standard HTTP
Authorization headers.
