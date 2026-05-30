---
title: Designing Crona's architecture
summary: A small data model keeps the app predictable and fast.
kind: blog
publishedAt: 2026-04-18
featured: true
order: 1
---

CRONA stays useful by refusing unnecessary abstraction. The data model is small, local-first, and easy to reason about, which means the interface can stay honest about what the app knows and what it still needs to infer.

That design choice is related to the argument in [Why local-first matters](/writing/blogs/why-local-first-matters): the less a user has to wait on remote state, the more the product feels like a place where work can continue uninterrupted.

The architecture is easier to hold in your head when the boundaries are narrow. CRONA only works well if the schema, the storage layer, and the surface UI all stay aligned on the same few concepts. Once those concepts multiply, the system begins to demand more attention than the task itself.

That is also why I think about [Keeping notes small](/writing/notes/keeping-notes-small) when I shape larger tools. Small units of meaning are easier to move across a system without breaking the surrounding structure.

I prefer systems that look boring from the outside and remain boring as they grow. The useful complexity belongs underneath the surface, not in the user’s path.

The external references that shaped this view are [Martin Fowler on distributed systems patterns](https://martinfowler.com/articles/patterns-of-distributed-systems.html) and [DDIA](https://dataintensive.net/), both of which make it harder to pretend the storage and coordination layers are incidental.
