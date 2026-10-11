---
title: Bringing document conversion in-house
category: Production document processing
summary: Bringing document conversion in-house.
role: Backend engineering at Appyhigh
order: 2
organization: Appyhigh
visibility: unlisted
technologies: [JavaScript, Node.js, WebSockets, PDF]
problem: A document-processing platform depended on third-party conversion APIs and needed reliable real-time communication under production usage.
contribution: Built an in-house PDF-to-Word pipeline, prototyped PDF-to-PowerPoint conversion, and maintained backend services and long-lived WebSocket connections.
outcome: Reduced dependence on external conversion services, with more control over processing behavior, reliability, and cost.
links:
  - label: Visit Scanner Go
    href: https://scannergo.net
---

## Owning the processing pipeline

Replacing third-party document conversion with our own implementation gave us more control over how processing behaved. PDF-to-Word became an in-house pipeline; PDF-to-PowerPoint was explored as a prototype.

## Keeping production healthy

Alongside feature work, I investigated live issues, fixed regressions, and deployed infrastructure changes. Maintaining long-lived WebSocket connections made the relationship between infrastructure behavior and user experience especially concrete.
