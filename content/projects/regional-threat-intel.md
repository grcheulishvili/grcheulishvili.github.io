---
title: "Regional Threat Intelligence Aggregator"
date: 2025-11-27
draft: false
description: "An automated pipeline that aggregates OTX, ThreatFox, and RSS feeds to filter C2 and IOC data specifically for the Caucasus region."
tags: ["CTI", "Python", "Grafana", "OSINT"]
---

# Project Status: [Active Development]

## The Problem
Global threat feeds are noisy. A "High Severity" C2 alert for a US-based bank is irrelevant noise for infrastructure in Georgia. This noise causes alert fatigue in the SOC, leading to missed detections of regionally relevant threats.

## The Solution
A custom aggregation engine that pulls from high-fidelity sources, filters data against a "Regional Relevance" dictionary, and visualizes active campaigns on a custom dashboard.

## Tech Stack
* **Core Logic:** Python (API Glue & Filtering Engine).
* **Feeds:** AlienVault OTX, ThreatFox (C2 Intel), and 100+ Security Blog RSS feeds.
* **Visualization:** Grafana (Real-time dashboarding of active threats).

## Key Modules
1.  **The Collector:** Async Python workers polling OTX and ThreatFox APIs.
2.  **The Filter:** A keyword/ASN matching engine that discards 99% of global noise to focus on threats targeting the region.
3.  **The UI:** Custom Grafana panels tracking "Active C2s in Region" and "Emerging Blog Topics."

---
*Codebase currently private. Deployment requires API keys for OTX.*
