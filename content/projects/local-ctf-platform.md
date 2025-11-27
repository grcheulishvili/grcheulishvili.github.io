---
title: "Enterprise Cyber Range (Customized CTFd)"
date: 2025-11-27
draft: false
description: "An on-premise skill validation platform built on a modified CTFd instance, featuring custom Linux, Crypto, and Web exploitation scenarios."
tags: ["Infrastructure", "CTFd", "Docker", "Training"]
---

# Project Status: [Production]

## Overview
To upskill the internal security team, I deployed and heavily customized a **CTFd** instance. Unlike standard CTFs which often focus on "guessing," this platform is designed to simulate real-world vulnerabilities found in our corporate environment.

## Custom Engineering
* **Interface Redesign:** Modified the default CTFd Jinja2 templates and CSS to match corporate branding and improve the UX for non-gamers.
* **Challenge Architecture:**
    * **Web Security:** Custom Docker containers running vulnerable apps (SQLi, SSRF, Insecure Deserialization).
    * **Linux Skills:** SSH-based challenges testing grep/awk/sed proficiency and log analysis.
    * **Reversing & Forensics:** Artifact analysis challenges based on real malware samples.
    * **Crypto:** Practical cryptography failures (e.g., weak RSA keys, padding oracles).

## Impact
* Reduced reliance on expensive external training vendors.
* Allows the team to practice "Red vs Blue" scenarios in a safe, isolated environment.

---
*Documentation on specific challenge design is available internally.*
