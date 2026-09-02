---
title: "Building Multi-Tenant CTF Wargames Platform"
date: 2025-11-27
draft: false
description: "A technical review of the Bastioni platform architecture, detailing the use of Split-SSH, user isolation, and intentional flaws for security training."
tags: ["Infrastructure", "Hardening", "Linux", "CTFd", "Engineering"]
stack: ["Linux", "CTFd", "Split-SSH", "Docker", "Bash"]
status: "Active"
repo: ""   # add a GitHub URL to surface a "View source" button
---

## Overview
This is a hybrid wargames platform built for scenario-based cybersecurity training. The primary technical challenge was engineering a secure, multi-tenant Linux environment where players (tenants) could exploit vulnerabilities against adjacent targets without compromising the entire system or affecting other players.

## 1. Isolation Architecture 

The platform implements three core layers of isolation to maintain stability and prevent cross-user pivoting:

### A. Split-SSH Access Control
Access is segregated at the network port level:
* **Port 22:** Restricted to administrators only (key-based authentication).
* **Port 2222:** Dedicated to players only (password-based authentication via the `game_users` group).
* **Defense:** This ensures administrative traffic is isolated from potential player brute-force attempts or protocol abuses, and allows separate Fail2Ban rules for each service.

### B. Process and File Hiding
The environment is hardened using system-level controls:
* **`hidepid=2`:** Ensures that players cannot see processes belonging to other users or challenge levels, preventing simple scanning for running exploits or user IDs.
* **`chmod 700`:** Enforced across all user home directories, ensuring strict privacy for player files and challenge assets.

### C. Containerized Boot-to-Root Scenarios
For high-risk challenges, a Docker-based architecture is used.
* The vulnerable target is run in an ephemeral, resource limited container.
* **Self-Healing:** A nightly reset script automatically tears down and redeploys the container, guaranteeing a fresh, known-good environment for every session.

## Utility
While currently an internal research asset, this architecture addresses a critical gap in technical hiring: **The lack of operational validation.**

Most interview processes rely on theoretical questions. This platform allows for "Live-Fire" assessment:
1.  **Candidate Access:** Generates an ephemeral environment.
2.  **Task:** "Fix the broken Nginx config" (Blue Team) or "Escalate to Root" (Red Team).
3.  **Result:** A binary Pass/Fail based on flag submission, proving actual keyboard competence.

*This system is currently deployed as a private Proxmox lab for infrastructure hardening research.*
