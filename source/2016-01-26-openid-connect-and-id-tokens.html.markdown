---
title: OpenID Connect and ID Tokens
date: 2016-01-26 09:25 MST
tags:
---

OAuth2 is fundamentally an authorization protocol. It is not meant to be
used for authentication. In general, OAuth2 based authorization services
provide an end point that can be used to retrieve user profiles and
identifiers. In some cases, they use [Signed JWTs](/signed-json-web-tokens/)
as a way to carry some identifiers. Still, the main focus is always
authorization.

[OpenID Connect](https://openid.net/connect/) is an identity protocol
that is built on top of OAuth2. Just like OAuth2, it provides a few
authorization flows that will result in access and refresh tokens being
issued and authorizing access to resources. However, the response from a
successful token grant also returns an ID Token. The ID Token is what
turns OpenID Connect into an identity protocol.

ID Tokens are signed JSON Web Tokens issued by the OpenID Connect
Identity Provider (IDP). They are sent to a Relying Party, which can use
the ID Token to establish the identity of the user or client.

ID Tokens have the same structure as any other JWTs:

1. A header providing information about the token's signature.
2. A payload containing a set of claims made by the Authorization
Server.
3. A signature block.

Each part is encoded using Base64 and are divided by periods.

Here is an example of the claims that are carried with an ID Token:

```json
{
  "sub"       : "alice",
  "iss"       : "https://openid.c2id.com",
  "aud"       : "client-12345",
  "nonce"     : "n-0S6_WzA2Mj",
  "auth_time" : 1311280969,
  "acr"       : "c2id.loa.hisec",
  "iat"       : 1311280970,
  "exp"       : 1311281970,
}
```
(From [OpenID Connect Explained](http://connect2id.com/learn/openid-connect).)

Of particular interest in here are the subject (`sub`), issuer (`iss`),
audience (`aud`) and expiration time (`exp`). These claims carry
information about who is identified by the token, who issued the token,
who is the intended audience fo the token and finally the validity
period of the token.

The key feature of ID Tokens in an authentication context is that it
provides a verifiable proof of identity from a third party. This
allows an application to delegate authentication to a trusted third
party while still retaining the ability to authorize access to it's own
resources.

[Google](https://developers.google.com/identity/) is one of the
companies that are implementing OpenID Connect. It is baked into Android
devices and Google Play. Many of the complications that occur when
implementing OAuth2 and OpenID Connect clients are handled as part of
standard APIs that are accessible to the developers. This makes Google
one of the biggest and possibly best source of identity data when it
comes to applications built for that platform.

