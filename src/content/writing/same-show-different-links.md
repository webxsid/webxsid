---
title: "The Same Show, Different Links: A Content Problem Worth Solving"
publishedAt: 2025-05-06
summary: "How do you tell when two different links point to the same content? In this post, I unpack one of the trickiest design challenges in Pebbles: normalizing content across platforms"
tags:
  - link-aggregation
  - content-normalization
  - recommendation-systems
  - metadata-matching
  - product-design
  - pebbles
featured: true
order: 3
kind: blog
seo:
  title: "The Same Show, Different Links: Solving Cross-Platform Content Matching"
  description: "A product and systems breakdown of how Pebbles can recognize when different Netflix, Prime Video, IMDb, or regional links all point to the same underlying piece of media."
---

The idea of [pebbles](/projects/pebbles) was simple: let people recommend what they love -- shows, podcasts, music, blogs or even a TikTok without the restrictions of a platform. But the moment we let users share any link from any source, things get tricky.

> How do we recognise that different URLs are actually pointing to the same media?

To us humans, it's obvious when a Netflix and a Prime Video URL refers to the same show / movie. But to a computer they're 2 completely different strings. If we don't solve this, things start to break.

- The same media gets posted multiple times
- Reaction & comments gets scattered
- Recommendations feel redundant
- Friends using different platforms don’t get direct, accessible links
- Friends in other countries hit a dead end with region-locked content

This post is just my brain dump trying to solve this problem. All the messy & maybe interesting ways I come up with to solve this without relying heavily on 3rd party APIs. 

---

## TL;DR

This whole problem, figuring out when two different links mean the same thing might seem small at first. But it’s shaping a lot of the core decisions behind Pebbles.

We’re not just building another place to drop links. The goal is to make recommendations feel personal, relevant, and connected and that starts with treating content with a little more respect than just a URL.

Nothing’s finalized yet. Things will change. But thinking about this now gives Pebbles a better shot at becoming something people actually enjoy using not just another feed. (Been saying that since day one.)

---

## Table of Contents

1. [The Problem](#the-problem)
2. [Why not use 3rd party APIs](#why-not-use-3rd-party-apis)
3. [Things I've considered](#things-ive-considered)
4. [Why am I worrying about this right now?](#why-am-i-worrying-about-this-right-now)

---

## The Problem

To better understand the problem let's work with an example, consider the popular TV sitcom FRIENDS:

- It might be available on Netflix in one country and Prime Video or Hulu in another
- It has a separate IMDB / Trakt / Letterboxd page
- The URL across different countries can be different
- The show might get removed from a previously available region

This results in noise, and that noise has real consequences for our app. The one I dread the most is that our app becomes a messy bookmark manager instead of a social layer for recommendations

## Why not use 3rd party APIs

I don't want to rely on 3rd party APIs like TMDB or Spotify, because

- The APIs are domain specific, which excludes indie websites (Especially blogs like this one)
- I don't want to deal with rate limiting, auth & the extra financial overhead
- Most of the ToS will restrict us to actually store the fetched data in our DB (fair but useless to us)

## Things I've considered

### 1. Manual Mapping

This is obviously not practical in any sense, but after spending hours trying to come up with something, I hit a “F**k it” point and genuinely considered mapping everything by hand. Just brute-force my way through a JSON file of known URLs and content pairs.

Needless to say, it was a fever dream. It doesn’t scale, it’s not fun, and thankfully, I’ve moved on.

### 2. Fuzzy Metadata Matching

This is the most promising approach so far — and likely the one we’ll start with.

#### How this will work

- Every URL shared on Pebbles gets its publicly available metadata extracted.
- From that, we identify fields like:
  - Title or name
  - Author / artist / creator
  - Production house / platform
  - Cast or contributors
- These are sanitized and hashed into a canonical ID that we can index.
- If two different URLs produce the same normalized hash → they’re likely the same piece of content.

The more structured data we can extract, the better our chances of uniquely identifying the content.

#### Challenges

- Metadata varies wildly between platforms. Some give rich detail; others give us scraps.
- We’ll need partial hash/index support to compare and score fuzzy matches.
- This system only learns about platforms that users actively share from. If no one ever shares a Hulu link, we can’t list Hulu as a source.
- It doesn’t automatically handle region-locked content — though in theory, we can store region-specific availability based on the user’s public IP or shared country.

### 3. AI Intervention

Not my first choice, but sometimes helpful.

When the metadata alone returns a bunch of “close enough” matches, I can feed those into something like GPT with a prompt to score and rank them. Pick the top match, discard the rest. Lightweight, fallback-only, and ideally infrequent.

### 4. Community Corrections

The idea here is to let users flag duplicates or incorrect merges. Like Wikipedia but for recommended content.

But this:
- Only works once we have enough users
- Needs careful moderation
- Still requires the metadata approach as a foundation

So yeah, this one’s for Future Me, not MVP Me.

## Why am I worrying about this right now?

I’ve been asking myself this a lot lately, why am I spending hours obsessing over this instead of just hacking together an MVP and moving to launch?

So I’m writing this down as a reminder for future-me when I inevitably ask the same thing again.

**Pebbles doesn’t work with a hacked MVP** - not the way I want it to.

If content shows up as duplicates, or if aggregation is half-baked, the product loses its core value. What should feel like a trusted space for recommendations from your friends and family ends up feeling like an over-engineered  bookmark manager.

Getting this part right, even just a rough version of it sets the tone for everything else. And it unlocks a lot of exciting possibilities down the road:
- “Popular Recommendations This Week”
- “Trending in Your Circle”
- Cross-platform watchlist / playlist syncing
- Smart reactions and global sentiment over time

It’s a foundational decision, not a feature. And I’d rather build it once with intent than duct-tape it later.

---

If you’ve made it this far, thanks for reading my little brain fart.

If any of this sparked an idea, a strong opinion, or even just the urge to tell me I’m massively overthinking it, feel free to reach out. Always happy to chat.

