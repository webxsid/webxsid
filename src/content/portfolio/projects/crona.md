---
title: Crona
description: A local-first work tracker with a background daemon, terminal UI, and CLI.
status: active
role: Creator & maintainer
technologies: [Go, SQLite, TUI, CLI]
links:
  website: https://crona.work
  repository: https://github.com/webxsid/crona
featured: true
order: 0
relatedCaseStudies: [local-first-work-tracking]
---

## Technical overview

Crona records work sessions, tracks progress, and organizes work around repositories and issues. A background daemon owns state and keeps timers and processing running independently of the terminal UI and CLI.

Go and SQLite keep the application and its data on the user's machine. The core workflow does not require an account or network connection.

## Engineering focus

The project involves terminal interface design, background processing, release engineering, observability, and cross-platform packaging. A recurring design challenge is surfacing useful information within the constraints of a terminal without making the interface demand attention.

<!-- TODO: Confirm the project start date before adding startedAt. -->
<!-- TODO: Add current screenshots with descriptive alt text to frontmatter. -->
<!-- TODO: Expand the technical overview with reviewed implementation details. -->
