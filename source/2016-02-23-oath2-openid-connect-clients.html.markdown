---
title: Clients In OAuth2 and OpenID Connect
date: 2016-02-23 09:25 MST
tags:
  - oauth2
  - openidconnect
  - auth
---

OAuth2 and OpenID Connect both have the notion of a client. In this
area, a client is any application or service that relies on the
authorization server for authorization.

Clients have their own credentials. They have a client identifier and a
secret that they provide to the authorization server to, well, provide
proof that they are authorized to obtain or verify tokens on behalf of a
user. JWT carry the client id as a way to determine which client
requested the token and whether they are known to the client receiving
said token, and they may be listed as the audience of a token.

An interesting authorization flow is the client credentials flow. This
allow a client to obtain a token to identify itself to other services.
This is different than the usual use case for OAuth2 based authorization
where a service or an application acts on behalf of a user. In this
case, the token is to show that the client wishes to identify and show
authorization to other clients with a common authorization service.

This has some interesting consequences in an environment where services
are no longer contained and protected by a common firewall. It shifts
the authorization model from "you can reach me, therefore you are
trustworthy" to "we trust a common third party, therefore we will trust
each other" model.
