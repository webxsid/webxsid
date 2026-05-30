---
title: Designing Data-Intensive Applications
type: book
creator: Martin Kleppmann
year: 2017
summary: A book that changed how I think about complexity, consistency, and the operational cost of every abstraction.
featured: true
publishedAt: 2026-05-29
seo:
  description: A book that reframed how I think about complexity, consistency, and operational cost.
---

## What stayed with me

The book is not memorable because it explains databases. It is memorable because it makes the tradeoffs unavoidable.

Every system eventually has to choose what to optimize for, what to tolerate, and what to make expensive. That idea stayed with me more than any single chapter.

## Ideas I still return to

- Complexity is usually paid for later.
- Constraints should be visible, not hidden.
- Operational burden is part of the design, not an afterthought.

## Why it matters

It shifted my focus from feature shape to system cost. That change in framing has influenced how I think about infrastructure, APIs, and the kind of software that needs to remain understandable after years of use.

The book lines up neatly with [Designing Crona's architecture](/writing/blogs/designing-cronas-architecture) and [Why local-first matters](/writing/blogs/why-local-first-matters), because both depend on the idea that a small model is easier to keep honest.

It also gives better language for [Pebbles](/projects/pebbles), where the feed has to stay quick even though the data behind it may eventually become messy.

External source: [The book site](https://dataintensive.net/) is useful when checking outbound references and preconnect hints.
