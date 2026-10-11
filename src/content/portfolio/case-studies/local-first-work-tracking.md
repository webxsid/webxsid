---
title: Local-first work tracking
category: Independent · open source
summary: A work tracker that lives where the work happens.
role: Creator & maintainer
order: 1
project: crona
featured: true
visibility: public
technologies: [Go, SQLite, TUI, CLI]
problem: Tracking work meant switching tools and handing a detailed record of my time to an external service.
contribution: Designed a local-first work tracker around a background daemon, with a terminal UI and CLI sharing one source of truth.
outcome: Work sessions and progress stay on the user's machine, while timers and background processing continue independently of the interface.
links:
  - label: Visit Crona
    href: https://crona.work
  - label: Source code
    href: https://github.com/webxsid/crona
---

## One engine, multiple interfaces

The daemon owns state and keeps timers, notifications, and processing running. The TUI provides richer navigation and history; the CLI handles quick actions without leaving the terminal. Neither interface needs to remain open.

## Local-first by design

Go and SQLite let the application keep its data on the user's machine without requiring an account or a network connection. This makes ownership part of the architecture rather than an optional setting.

## Beyond the core feature

Building Crona has involved terminal interface design, release engineering, observability, cross-platform packaging, and the trade-offs of maintaining software that lives on someone else's machine.
