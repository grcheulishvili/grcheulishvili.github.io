---
title: "Honeypot Agent"
date: 2025-11-27
draft: false
description: "A polymorphic Go-based info-stealer and C2 designed for offensive operations and honeypot monitoring."
tags: ["MalDev", "Go", "C2", "Polymorphism"]
---

# Project Status: [Research / Active]

## Overview
This is a stealthy agent designed to let attackers "catch themselves." When deployed on a honeypot, it mimics legitimate software while establishing a covert channel back to a custom Command & Control (C2) server.

## Technical Architecture
The system consists of three core components:
1.  **The Agent (`stealer`):** A GUI-less Go payload that runs silently on the victim machine.
2.  **The C2 (`receiver`):** A Linux-based server managing multiple sessions and exfiltrated data.
3.  **The Builder:** A custom GUI tool to generate polymorphic payloads on demand.

## Key Capabilities

### 1. Polymorphism & Evasion
* **Dynamic Builds:** The `Makefile` generates a unique file hash for every build, evading hash-based signaling.
* **Debug Stripping:** Automatically removes DWARF tables and symbol information to complicate reverse engineering.
* **Hidden Execution:** Runs as a background process on Windows without flashing the console.

### 2. The "Pillage" Workflow
I engineered a two-stage exfiltration process to optimize bandwidth:
* **Stage 1 (Recon):** Grabs "Recent Files" and system info immediately upon connection.
* **Stage 2 (Deep Dive):** The `pil_fil` command allows operators to surgically extract specific extensions (e.g., `.pdf`, `.docx`) or directories.

### 3. Persistence & Self-Destruct
* **Persistence:** Modifies the Windows Registry Run keys for survival across reboots.
* **Kill Switch:** The `quit` command triggers a self-destruct routine, scrubbing the registry keys and deleting the agent binary from the disk.

## Code Snippet: Makefile Logic
```makefile
# Example of build automation for stealth
build_stealer_windows:
    GOOS=windows GOARCH=amd64 go build -ldflags="-s -w -H=windowsgui" -o dist/stealer.exe
```

---
*This tool is for educational research and authorized honeypot deployment only.*