---
title: "Research: Bypassing Modern File Upload Filters"
date: 2025-11-27
draft: false
description: "A consolidated analysis of Content-Type spoofing, Path Traversal, and Blacklist evasion based on recent lab research."
tags: ["Web Security", "Research", "Pentesting"]
---

## Abstract
File upload vulnerabilities remain a critical vector for Remote Code Execution (RCE). While developers often implement validation mechanisms (MIME type checks, blacklists), these are frequently based on "trusting user input." This report documents specific bypass techniques I analyzed during recent research.

## 1. Content-Type Spoofing
Many applications validate the `Content-Type` header sent by the browser but fail to validate the actual file magic bytes.

* **The Flaw:** The server trusts the client-side header `image/jpeg` but processes the file as PHP.
* **The Bypass:** Intercepting the request and changing `Content-Type: text/plain` to `Content-Type: image/jpeg` allows the upload of arbitrary code.
* **Impact:** Complete RCE if the server is configured to execute PHP in the upload directory.

## 2. Path Traversal in Filenames
Servers often use the provided filename to determine the save location. If this input is not sanitized, it allows escaping the intended upload directory.

* **Technique:** Modifying the filename parameter:
    ```http
    Content-Disposition: form-data; name="avatar"; filename="..%2Fmal.php"
    ```
* **Result:** The file is saved to `/files/mal.php` instead of `/files/avatars/mal.php`, potentially bypassing `.htaccess` restrictions placed on the images folder.

## 3. Blacklist Evasion & Configuration Overrides
Blacklisting extensions (blocking `.php`) is notoriously difficult to maintain.

* **Apache .htaccess Override:** If the server allows uploading `.htaccess` files, an attacker can redefine executable extensions.
    ```apache
    AddType application/x-httpd-php .hack
    ```
    * *Effect:* Uploading a shell named `shell.hack` will now execute as PHP.
* **Obfuscation:** Using alternative extensions (`.php5`, `.phtml`) or casing (`.pHp`) often bypasses weak regex filters.

## Conclusion
Robust file upload security requires a defense-in-depth approach:
1.  **Rename files** on the server (do not use user-provided names).
2.  **Validate Magic Bytes**, not just headers.
3.  **Store uploads outside the web root** or on a separate cloud bucket (S3).

