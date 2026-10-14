---
version: alpha
colors:
  background: "#07111f"
  surface: "#0d1d2d"
  elevated: "#102438"
  border: "#1b3650"
  foreground: "#ecf7ff"
  muted: "#8ea7bb"
  primary: "#19d3bd"
  secondary: "#8b5cf6"
  warning: "#f0b557"
  danger: "#ff758a"
typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
rounded:
  panel: "22px"
  control: "13px"
omitted:
  - section: spacing
    reason: "Existing styles.css owns component spacing without a global spacing token scale."
  - section: components
    reason: "Shared CSS classes are the existing component recipes, not a separate tokenized UI framework."
---

# Cyber Study Hub — Design

## Overview

Study workspace for Brazilian learners and instructors on mobile PWA and desktop. North star: answer where I am, what to study now and how to get back. The experience is a study tool, never a marketing landing page. Preserve the established midnight navy and teal identity.

## Colors

The runtime variables in src/styles.css are canonical. This document mirrors those values (ownership model B). Use teal for primary actions, activity progress and keyboard focus; purple is an accent, not a completion state. Every count and progress bar requires a corresponding textual explanation. A total of 543 catalog items never means 543 interactive completions are available.

## Typography

Inter/system stack with restrained editorial headings, short Portuguese labels and descriptive action verbs. Avoid generic advertising copy or unexplained technical jargon in navigation.

## Layout

Desktop uses the existing sidebar and centered reading region. Mobile has six consistent destinations with safe-area-aware bottom navigation, readable labels and enough document padding to reach the final line without obstruction. Main tasks are reachable above the fold; very long library lists load progressively in batches of 24.

## Elevation & Depth

One emphasized next-lesson card, neutral stats, understated navigation cards, limited gradients and quiet shadows. Do not invent celebratory states.

## Shapes

Panels between 18px and 25px, controls between 13px and 16px. Preserve the existing button and panel vocabulary.

## Components

Dashboard owns recommendation and catalog entry points. CurriculumBrowser owns filters, list browsing and parallel track activation. PlatformGate and accountStorage exclusively own identity, session and synchronized progress. Do not duplicate any of them.

## Do's and Don'ts

Do present Aula 001 as the beginner entry and use account-owned progress for returning users. Do maintain real deep links and accessible keyboard focus. Do not hardcode Aula 43 for new learners or misrepresent Markdown-only lessons as completed. Do not change private API contracts for a visual improvement.
