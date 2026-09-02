---
title: "Mantis C2 Architecture"
date: 2025-11-27
draft: false
description: "A Command and Control framework focusing on signature evasion and resilient communication."
tags: ["MalDev", "Go", "C2"]
---

## Overview

Mantis C2 is a proof-of-concept, educationally designed Command and Control framework built to test and bypass EDR telemetry. Commercial and widely available C2 frameworks often carry heavily signatured stubs; Mantis was built from the ground up to minimize the footprint of static and behavioral anomalies.

## 1. Evasion and Persistence Architecture

### AST-Driven Polymorphism Protocol

To defeat static analysis, the builder utilizes a custom code mutation protocol:

* The agent is processed by a dedicated pre-compiler that mutates the syntax trees (AST) to generate **structurally unique binaries** for every deployment. This defeats CFG (Control Flow Graph) analysis and static signatures, which is a significant step beyond simple file hash mutation.
* All sensitive strings (e.g., C2 domains, commands) are automatically located and encrypted at the code level prior to compilation, and they are decrypted at runtime using a key dynamically loaded into the file's memory.
* In the next stage, instead of writing to disk, Mantis allocates memory dynamically and executes the shellcode directly.
* All DWARF tables and symbol information are automatically stripped during cross-compilation, which severely complicates the reverse engineering process.

### Stealth

* The agent runs silently as a background process.
* Connection intervals with the server are heavily randomized. Upon waking, the agent masks its memory regions to prevent the detection of inactive malicious threads during memory scanning.

### Self-Destruction

A command specified by a predefined keyword triggers a self-destruct routine, which is critical for operational cleanup:

1. It deletes the Windows Registry Run keys used for persistence.
2. It deletes its own binary file from the disk.
3. It terminates the session and signals the C2 server.

## 2. Data Telemetry

The primary strength is the split telemetry model, designed for high-volume, rapid data exfiltration:

1. Data is sent immediately in small, encrypted packets via a covert TCP channel. This ensures continuous data reception even if the session is unexpectedly terminated.
2. An immediate **Stage 1 Recon Report** is generated upon connection, providing the operator with critical system and file metadata before any command is issued.
3. Files that exceed a defined limit are automatically transmitted in chunks, bypassing the compression engine to prevent memory spikes and keep CPU load minimal.

## 3. Builder and Sanitization

The framework contains a tool for generating payloads.

> **Note:** *To maintain security standards and prevent misuse, this public documentation does not include core features such as encryption keys, C2 IP/port configuration, and the complete logic for multi-threaded session management. To understand the technical mechanisms behind the polymorphic build, please refer to the dedicated research: [Go AST Polymorphic Engine](https://grcheulishvili.github.io/research/building-a-polymorphic-engine/).*

---

*This tool is intended solely for educational research and authorized internal threat simulation.*