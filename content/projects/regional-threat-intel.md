---
title: "Regional Threat Intel Aggregator"
date: 2025-11-27
draft: false
description: "A Python-based high-fidelity CTI aggregation engine for filtering open-source feeds."
tags: ["CTI", "Python", "Grafana", "PostgreSQL", "Engineering"]
stack: ["Python", "PostgreSQL", "Grafana"]
status: "Active"
repo: ""   # add a GitHub URL to surface a "View source" button
---

## Overview
This custom-built CTI dashboard solves the critical problem of alert fatigue by engineering a system that filters high-volume open-source feeds down to a high-fidelity list of indicators. The system focuses exclusively on APT activity and C2 infrastructure relevant to a **defined threat landscape**.

## 1. Technical Architecture and Data Flow

The system runs on a containerized microservices architecture to ensure resilience and maintainability:
* Python-based collector services act as API consumers and data parsers.
* PostgreSQL provides robust relational storage for structured IOCs.
* Grafana is used for real-time monitoring and threat landscape visualization.

### Data Aggregation and Filtering
Independent collectors manage the ingestion and scoring:
1.  **`collector-news`:** Parses RSS feeds and scores articles based on high-relevance keywords (e.g., "Critical Infrastructure," "Cyber Attack," "Vulnerability Disclosure") and regional filters.
2.  **`collector-ioc-threatfox` / `collector-otx`:** Ingests technical indicators (IPs, Hashes) from open feeds, applying a geographical and campaign-based filter before insertion into the database.

## 2. Operationalizing Intelligence

The system's value is in its downstream integration with defensive tools:
* A dedicated, read-only PostgreSQL user is created.
* This allows internal network security solutions to pull the high-fidelity, filtered blocklist directly from the CTI database every hour, automating the defense loop.

## 3. Deployment and Environment Configuration

The entire stack is deployed via Docker Compose to guarantee portability and fast rebuilds.

* The system is deployed behind an Nginx Reverse Proxy with an SSL/TLS certificate to secure the Grafana web interface.
* To prevent credential leakage, Grafana is configured to connect to the internal `postgres:5432` container using environment variables and a shared internal network.

**Deployment Snippet:**
*The following example shows the configuration required for Grafana to secure the web UI and connect to the internal database.*

```yml
grafana:
    # ... (details omitted)
    environment:
      - GF_SECURITY_ADMIN_USER=${GF_ADMIN_USER}
      # The database connection uses the internal Docker network name
      - GF_SERVER_ROOT_URL=https://IP_OR_DOMAIN/  
    networks:
      - cti_network
    depends_on:
      - postgres
```
> Disclaimer: Specific regional filtering keywords, API keys, and sensitive production configuration details are omitted. This report focuses on the architectural decisions and filtering methodology employed to solve the high-volume CTI problem.
