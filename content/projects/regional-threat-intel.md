---
title: "Regional CTI Dashboard"
date: 2025-11-27
draft: false
description: "A specialized Threat Intelligence platform filtering OTX and ThreatFox data for the Caucasus region using Grafana and PostgreSQL."
tags: ["CTI", "Python", "Grafana", "PostgreSQL"]
---

# Project Status: [Production]

## System Overview
The CTI Dashboard is a custom intelligence aggregation platform designed to combat alert fatigue. Unlike generic feeds, it filters specifically for APT groups and C2 infrastructure targeting a **specific geographic region**.

## Architecture
The system runs on a containerized microservices architecture:
* **Core:** Python-based collectors acting as API glue.
* **Storage:** PostgreSQL (\`threat_db\`) for structured IOC retention.
* **Visualization:** Grafana for real-time monitoring of active campaigns.

## Custom Collectors
I developed independent services for specific intelligence vectors:
1.  **\`collector-news\`**: Parses RSS feeds and scores articles based on regional keywords.
2.  **\`collector-ioc-threatfox\`**: Ingests technical indicators (IP/Hash) from ThreatFox.
3.  **\`collector-otx\`**: Polls AlienVault OTX for "pulses" related to specific APTs.
4.  **\`collector-c2feeds\`**: Automates the tracking of active Command & Control servers.

## Integration: Cisco Stealthwatch
To operationalize the data, I built a direct integration for network security tools.
* **Method:** Created a read-only PostgreSQL user (\`stealthwatch_user\`) allowed to query the \`public\` schema.
* **Impact:** Allows the internal firewall/NDR to pull high-fidelity blocklists directly from the CTI database without manual export.

---
*Deployment is managed via Docker Compose. Source code includes a custom importer for historical MaxMind and OTX data.*