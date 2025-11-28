---
title: "Bastion Wargames Platform"
date: 2025-11-27
draft: false
description: "A hybrid wargame platform combining a CTFd frontend with a hardened Linux backend using Split-SSH architecture."
tags: ["Infrastructure", "CTFd", "Hardening", "Linux"]
---

# Project Status: [Production]

## Philosophy
Bastion is designed around **progressive scenario-based learning**, mimicking the "OverTheWire" mechanic where \`Flag = Next Password\`. Unlike standard CTFs, the goal is not just to find a string, but to compromise the user account of the next level.

## Hybrid Architecture
1.  **Frontend:** Containerized **CTFd** handling scoring and user registration.
2.  **Backend:** Hardened Ubuntu Server hosting live SSH challenges.
3.  **Split-SSH Access Control:**
    * **Port 22:** Admin access only (Key-based).
    * **Port 2222:** Player access (Password-based, restricted shell).

## Challenge Design Patterns
I standardized three distinct challenge archetypes to cover the full offensive spectrum:

### 1. "Alpha" (Privilege Escalation)
* **Concept:** The player starts as \`user\`. The flag is the password for \`user+1\`.
* **Mechanic:** Exploiting intentional misconfigurations (e.g., SUID binaries, insecure Cron jobs, group-writable files) to pivot to the next user.
* **Isolation:** \`hidepid=2\` ensures players cannot see processes belonging to other levels.

### 2. "Bravo" (Red Team / Boot-to-Root)
* **Target:** Vulnerable Docker containers (e.g., modified DVWA) exposed internally.
* **Goal:** Web Exploitation $\rightarrow$ Reverse Shell $\rightarrow$ Root Flag.
* **Maintenance:** Automated nightly reset scripts destroy and redeploy the containers to ensure a fresh environment for every session.

### 3. "Charlie" (Forensics & Reversing)
* **Concept:** Self-contained analysis tasks.
* **Tooling:** Custom access groups (e.g., \`tools-gef\`) grant access to debuggers like \`GDB/GEF\` or \`Radare2\` only to specific users, keeping the environment clean.

---
*Infrastructure is hardened with UFW default-deny policies and Fail2Ban integration.*