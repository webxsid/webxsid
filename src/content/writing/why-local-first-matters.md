---
title: Why local-first matters
summary: Local ownership changes how software feels under pressure.
kind: blog
publishedAt: 2026-03-29
featured: true
order: 2
seo:
  description: Why local ownership changes the way software behaves under pressure.
---

Local-first software stays responsive even when the network is not. That changes the trust model in a way users can feel immediately, because the thing you are using is still the thing you own.

That is why I keep returning to [Crona](/projects/crona) when I think about the shape of the site and the shape of the app. A good local-first product does not just survive bad connectivity; it preserves momentum, and momentum is usually what gets lost first when a tool is too dependent on a remote round trip.

The goal is not to reject sync. The goal is to make sync a background concern instead of the center of gravity. That distinction matters when the system grows, because once the product begins to accumulate state, the cost of every network decision becomes visible in the interface.

I also keep the book [Designing Data-Intensive Applications](/references/designing-data-intensive-applications) nearby as a reminder that these choices are rarely free. If the storage model is opaque, the application becomes harder to reason about. If the data model is small and explicit, the software tends to remain legible longer.

For a more practical framing of the same idea, the essay at [The Cathedral and the Bazaar](/references/the-cathedral-and-the-bazaar) is useful because it points at coordination as a product constraint rather than a social afterthought.

External reading I keep around for this topic includes [Ink & Switch on local-first](https://www.inkandswitch.com/local-first/) and [CRDTs](https://crdt.tech/), mostly because they make the tradeoffs concrete instead of rhetorical.
