# 1b - OWASP TOP 10 2021

## 1. Broken Access Control

An application has multiple access points from the outside. The goal of Access Control is to allow authorized users to access it and block unauthorized users. BAC means that an unauthorized user will gain access to the data of an authorized user. For example, by using an API.

## 2. Cryptographic Failures

* Weak encryption of sensitive information or no encryption at all.&#x20;
* Certificate management&#x20;
* Downgrade attacks&#x20;
* Automatic encryption (good) & automatic decryption (bad)

## 3. Injection

* LDAP
* SQL
* XSS
* Incorrect Sanitization

## 4. Insecure Design

Related to application design and architectural flaws. Anything that can be exploited by an attacker to cause damage is Insecure Design.

## 5. Security Misconfiguration

* Non-latest features
* Delayed Updates
* Non-removed testing application on the server(have a known vulnerability, open ports)
* error message(non-handled exceptions, detalis)
* TLS

## 6. Vulnerable and Outdated Components

* know vulnerabilities
* external components
* external libraries
* frameworks

## 7. Identification and Authentication Failures

* User auth and identification problems
* Session timeout

## 8. Software and Data Integrity Failures

basically it means making software changes without checking CI/CD integrity and authenticity.

* updates are not verified before updating - attacker can change software
* monitoring software source was infiltrated and then pushed this compromised software to endpoints.

## 9. Security Logging and Monitoring Failures

* insufficient logging and monitoring
* leaving out important asset monitoring and logging
* alerts for suspicious activities
* log file storage should not be only locally(backup)
* alert threshold

## 10. Server Side Request Forgery

SSRF occurs when web application fetches remote resource without validating user-supplied request/url. fetching an url is common feature nowadays.

during SSRF an attacker FORGES a request that can retrieve unauthorized data from the server back to an attacker.
