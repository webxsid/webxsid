---
title: Crona
summary: Local-first work tracker for developers.
status: active
stack:
  - Go
  - SQLite
tags:
  - Local-first
  - Productivity
  - Developer tools
order: 1
featured: true
updatedAt: 2026-06-04
source: https://github.com/webxsid/crona
website: https://crona.work
detailsPage: true
seo:
  description: A local-first work tracker for developers who want focus and operational clarity.
---

This started from a frustration I kept running into. 

Every productivity tool felt like a new destination, another window to leave open, 
another place to organise work before I could actually begin doing it. 
As someone who already spends most of the day in a terminal, that always felt backwards. 
I wanted something that stayed closer to my work instead of making me change context just to track it.

This frustration eventually became [Crona](https://crona.work).

Rather than managing projects, Crona focuses on maintaining momentum. 
It records work sessions, tracks progress over time, organises work around repositories and issues, 
and tries to answer a simple question: [***what have I actually been doing?***](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGdpeWVhcmNvb2FxZGR1ejV6eHozeTV1ejBidXg4OHE3djhtYjRlbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xeuOy2Fcl9vDGiA/giphy.gif) 

I believe people should own the data they create, so building Crona as a local-first application was an easy decision, but it wasn’t just about privacy. 
Keeping everything on the user’s machine also removes unnecessary infrastructure, 
makes the application more responsive, and avoids introducing accounts or network dependencies before they actually solve a problem.

The hardest problem I've faced while building Crona isn't the data structure, the data collection or even the performance. 
It's been designing an interface that feels intuitive within the constraints of a terminal — something that blends in rather than demanding attention, 
while surfacing enough information to help users make better decisions.

Building Crona has also become an excuse to explore parts of software engineering that I rarely get to touch professionally. 
It’s where I’ve experimented with terminal user interfaces, background daemons, SQLite as an application database, release engineering, observability, 
cross-platform packaging, and the trade-offs that come with designing software intended to live on a user’s machine for years rather than months.

More than anything, Crona has become a reflection of the way I think software should be built: respectful of the user’s ownership, and 
content to fit naturally into an existing workflow instead of trying to become the workflow itself.
