---
title: Signed JSON Web Tokens
date: 2016-01-19 09:25 MST
tags:
---

Let's continue using the analogies used in my [last
post](/identity-and-flying/) and explore the JSON Web Tokens (JWT).

You hand over both your boarding pass and an identity document. The agent
scans the boarding pass and examines the identity document to check it's
authenticity. Both documents are validated quickly and handed back to
you.

Interestingly, there was no communications to a remote system to verify
the identity document's authenticity. All the agent did was check for
the security features on the document itself.

The same is true of the boarding pass. There are no queries sent to the
airlines to verify that the boarding pass is real and correct. The
barcode contains all the flight and flyer information. It also carries a
digital signature that is used to verify that it is indeed correct.

Both features allow flyers to flow through security (fairly) quickly and
to get to their gates.

Signed JWTs are little bundle base 64 encoded data that has been signed
by the issuer using either symetrical signing key (a single key can be
used to sign and verify a document) or asymetrical signing keys (a private
key is used to sign the document and it's public counterpart is used to
verify the signature).

A JWT has 3 parts:

1. A header that indicates how the document was signed
2. A payload, which includes a certain number of claims that are carried
by the token
3. A signature block for the combined payload and header.

Each part is divided by a period.

The payload itself isn't entirely defined in [RFC 7519](https://tools.ietf.org/html/rfc7519), but they usually
carry a claim about the issuer and the subject associated with the
token. It may include other claims. Some claim names are registered
where others are custom to the implementation. This allows the JWT to
carry identifiers, expiration time, issuance time, audience and other
data that is of interest to the applications that issue and accepts them
for identification.

The signature is the key feature that allows the JWT to be sent around
and validated. A signed JWT allows the consumers of the token to:

* Verify that it was indeed issued by the issuer
* Verify that it was not modified in transit.

I prefer to sign the JWT using asymetric signing keys. Symetrical key
are shared by both issuers and consumers and as a result, it must be
protected on both sides. Asymetrical keys allow the issuer to sign the
token using the private key while publishing the public key. The key win
here is that the consumer of the token can download the public key and
use it to validate the token instead of sending the token back to the
issuer for validation (which is also supported). It also means that the
issuer does not have to store the tokens in order to validate the token
when a validation is requested by a consumer.

This allows to distribute token validation to the consumers of the
tokens instead of centralizing it in the authorization server. It also
opens up other possibilities that we'll discuss in a future article.



