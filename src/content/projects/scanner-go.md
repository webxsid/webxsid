---
title: "Scanner Go"
summary: "Backend infrastructure and document processing for a PDF editing platform."
status: archived
stack:
  - Javascript
  - Node.js
  - WebSockets
tags:
  - Document Processing
  - PDF
  - Production Systems
  - Backend
  - Professional Work
order: 4
updatedAt: 2026-07-04
featured: false
detailsPage: true
seo:
  title: "Scanner Go"
  description: "Backend infrastructure and document processing for a PDF editing platform."
company:
   name: Appyhigh
   slug: appyhigh
website: https://scannergo.net
---

Scanner Go gave me my first experience maintaining a production system that people relied on every day. While the application itself focused on document scanning and PDF utilities, my work lived almost entirely behind the scenes.

I worked on the backend services that powered document processing, maintained long-lived WebSocket connections for real-time communication, and spent a lot of time debugging production issues as they appeared. It was the first time I experienced how quickly small infrastructure problems can become user-facing issues at scale.

One of the more interesting pieces of work was replacing third-party document conversion services with our own implementations. I built an in-house PDF to Word conversion pipeline and later prototyped PDF to PowerPoint conversion, reducing our dependence on external APIs while giving us more control over performance, reliability, and cost.

Beyond feature work, a large part of the role involved keeping the production system healthy. That meant investigating live issues, fixing regressions, deploying infrastructure changes, and making sure document processing continued to work reliably under real-world usage.

Looking back, Scanner Go taught me less about PDFs than it did about operating production systems. It was my first exposure to the reality that backend engineering isn't just writing features—it's understanding failures, removing operational bottlenecks, and building systems that continue working long after they've been deployed.
