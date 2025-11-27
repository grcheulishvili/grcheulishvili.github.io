# 1e - SQL injection

SQLi is a web security vulnerability that allows an attacker to interfere with the queries that an application makes with its database. This enables to see the sensitive data. In many cases it is also possible to meddle with that data and delete or modify them.

It may even enable an attacker to perform either DDOs or compromise who database infrastructure.

Typically there are manual ways to SQLi vulnerability in an application

1. look for errors or anomalies when using `'`
2. Boolean conditions and web applications reaction to it. `OR 1=1` and `OR 1=2`
3. Payloads designed to trigger time delays within a SQL query. look for time differences
4. OAST payloads deigned to trigger out-of-band network interaction when executed
5. some SQL-specific syntax that returns to original value and to different values

Or to find these vulnerabilities automatically, use Burp Scanner.

**As an example**, imagine there is a shopping application that displays products in different categories. When user clicks Gifts category, the browser request a URL:

`https://insecure-website.com/products?category=Gifts`

This causes the application to make a SQL query to retrieve further details about products

`SELECT * FROM products WHERE category = 'Gifts' AND released = 1`

I'm guessing the existence of `released=1` implies the existence of `released=0`, huh?

This application doesn't have a protection mechanisms against SQLi. This means that something like this could be constructed

`https://insecure-website.com/products?category=Gifts'--`

which would send a following query

`SELECT * FROM products WHERE category = 'Gifts'--' AND released = 1`

where `--` is a comment indicator in SQL, which means `AND released = 1` will be ignored - Therefore, displaying all the data.

A similar attack:

`https://insecure-website.com/products?category=Gifts'+OR+1=1--`

The SQL query:

`SELECT * FROM products WHERE category = 'Gifts' OR 1=1--' AND released = 1`

This query returns all items.
