---
title: "Taptic"
summary: Backend infrastructure for a remote technical interview platform.
status: active
order: 2
stack:
  - Node.js
  - TypeScript
  - NestJS
  - AWS
tags:
  - Distributed Systems
  - Backend
  - Serverless
  - Infrastructure
  - Production Systems
updatedAt: 2026-07-05
featured: false
detailsPage: true
seo:
  title: "Taptic"
  description: Backend infrastructure for a remote technical interview platform.
company:
  name: Taptic
  slug: taptic
website: https://taptic.ai
---

Taptic is a platform for conducting remote technical interviews. At first glance it looks fairly straightforward—schedule an interview, join a meeting, write some code—but keeping that experience reliable requires a surprising amount of coordination behind the scenes.

My work has primarily focused on the backend systems that support that experience. Scheduling workflows, interview lifecycle management, authentication, recording infrastructure, notifications, automation pipelines, and the operational tooling that keeps the platform running all sit within that scope.

One of the more significant pieces of work has been modernising the backend platform itself. Parts of the system originally ran as a collection of Serverless Node.js services on AWS Lambda, API Gateway, Step Functions, SES, and SNS. As the platform evolved, we began migrating services to a more structured NestJS architecture running on Elastic Beanstalk, introducing stronger boundaries, better observability, and a codebase that was significantly easier to reason about and maintain.

A platform like Taptic also spends most of its life dealing with situations users never see when everything is working correctly. Recording pipelines have to recover from failures, scheduled workflows need to tolerate retries and partial completion, interview state must remain consistent across multiple connected participants, and operational tooling has to surface problems before they become customer-facing incidents.

That operational aspect is probably what I've enjoyed most. A large part of the work involves tracing production issues, understanding failures across distributed systems, improving observability, and gradually simplifying infrastructure that has accumulated complexity over time. It's the kind of engineering where reliability isn't a feature—it's the product.

Working on Taptic has reinforced something I already believed: the best backend systems aren't necessarily the most sophisticated ones. They're the ones that quietly continue doing their job while allowing everyone else to focus on theirs.
