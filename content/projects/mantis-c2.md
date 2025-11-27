---
title: "Project Mantis: Evasion Research"
date: 2025-11-27
draft: false
description: "A research workspace for testing EDR evasion techniques in Go."
tags: ["MalDev", "Go", "Research"]
---

# Status: [Research Phase]

## Concept
Mantis is a codebase I use to experiment with Windows API interaction in Golang. It serves as a testbed for understanding how modern EDRs hook specific syscalls and how static signatures are generated for Go binaries.

## Current Research Focus
* **Syscall Unhooking:** Analyzing how direct syscalls can bypass userland hooks.
* **Sandbox Heuristics:** Implementing checks for CPU cores and uptime to detect analysis environments.

---
*This is a private research project.*
