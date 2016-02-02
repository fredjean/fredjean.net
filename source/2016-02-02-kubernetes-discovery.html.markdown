---
title: Kubernetes Service Discovery
date: 2016-02-02 09:25 MST
tags: kubernetes
---

I am helping my client transition from a few large monoliths hosted on
AWS to micro-services hosted on Kubernetes. It is my first experience
with Kubernetes and I must say that I am impressed so far.

Of course, micro-services work best when it is easy to find a service's
dependencies. This is one area where Kubernetes shines as it has a well
designed service abstraction.

You can find services through two approaches:

1. Using the environment variables that use the same conventions as
those created by Docker links.
1. Using DNS to resolve the service names to the service's IP address.

## Environment Variables

Kubernetes injects environment variables for each service and each port
exposed by the service. This makes it easy to deploy containers that use
Docker links to find their dependencies. For example, if we are exposing
a RabbitMQ service, we can locate it using the
`RABBITMQ_SERVICE_SERVICE_HOST` and `RABBIT_MP_SERVICE_SERVICE_PORT`
variables. Other environment variables are also exposed to support this.

The easiest way to find out what environment variables are exposed are
to exec the `env` command within a pod:

```shell
kubectl exec memcached-rm58b env | grep RABBITMQ
RABBITMQ_SERVICE_SERVICE_HOST=10.0.143.172
RABBITMQ_SERVICE_SERVICE_PORT_A=5672
RABBITMQ_SERVICE_PORT_5672_TCP_ADDR=10.0.143.172
RABBITMQ_SERVICE_PORT_15672_TCP_ADDR=10.0.143.172
RABBITMQ_SERVICE_PORT_15672_TCP_PORT=15672
RABBITMQ_SERVICE_PORT_15672_TCP=tcp://10.0.143.172:15672
RABBITMQ_SERVICE_PORT_5672_TCP_PORT=5672
RABBITMQ_SERVICE_SERVICE_PORT_B=15672
RABBITMQ_SERVICE_PORT_5672_TCP_PROTO=tcp
RABBITMQ_SERVICE_PORT=tcp://10.0.143.172:5672
RABBITMQ_SERVICE_PORT_5672_TCP=tcp://10.0.143.172:5672
RABBITMQ_SERVICE_PORT_15672_TCP_PROTO=tcp
RABBITMQ_SERVICE_SERVICE_PORT=5672
```

## DNS Resolution

Kubernetes has a kube-dns addon that exposes the service's name as a DNS
entry. As a result, you can tell your application to connect to a host
name. The advantage of this approach is that you do not need to do
anything different than you would otherwise.

The service names are scoped within namespaces. This allows you to run
different deployment of a service for each namespace (for example, one
per developer or one per environments) without having to edit
configuration files.

## Benefits

You can use either approach to write services that adapt to the
environment in which they are deployed without having to change it's
configuration.

## But What About the API?

Kubernetes provides a powerful API that allows you to inspect and
discover services, replication controllers, pods and other component of
a cluster. This would allow you to build deeper service discovery
mechanisms where appropriate. But they are generally overkill for the
needs of an application that needs to connect to it's dependencies. I'll
discuss a few scenarios where this can be useful in a future post.

