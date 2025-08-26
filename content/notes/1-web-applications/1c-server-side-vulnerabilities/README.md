# 1c - Server-Side Vulnerabilities

### Path Traversal

Also known as directory traversal. this type of vulnerabilities enable an attacker to read files on the server including:

* Application code and data
* Credentials
* sensitive files

In some cases, an attacker might also be able to write files.

Supposing we got image tag on a website:

* `<img src="/loadImage?filename=218.png">`

the `loadImage` URL takes a filename parameter with an image path and it doesn't check for path traversal vulnerability, so a following could be done to retrieve other information.

the `218.png` is appended to `/var/www/images/218.png`. we can traverse up a directory using `'../'` and reach `/etc/passwd`like so: `https://insecure-website.com/loadImage?filename=../../../etc/passwd`

In many cases where user input is used for file paths, there are usually defense mechanisms in place, which can be often bypassed.

In case these defense mechanisms block absolute paths, there might be a way to overcome them. such as using nested traversal paths `....//` or `....\/`

sometimes when `multipart/form-data` requests are made, URL is stripped of any path traversal inputs. so the way to overcome them might be to use URL encoded character, `../` turns to `%2e%2e%2f` and so on. You may need to encode URL twice - If an application decodes it once second one will pass the defenses.

An application might also require a user supplied file extension such as `.png`. In this case it might be possible to use a null byte to ignore characters after it. like so - `filename=../../../etc/passwd%00.png`

The most effective way to prevent path traversal attacks is to just avoid user-supplied paths.

In case it cannot be avoided, implement 2-way defense mechanism

1. Validate user input
2. Append the file path to base directory

## Access Control

Access control is the system of constraints on who or what is authorized to perform actions or access resources. Access Control is dependent on authentication and session management:

* **Authentication** confirms that the user is who they say they are
* **Session Management** identifies which subsequent HTTP requests are made by the same user
* **Access Control** Determines whether the user is allowed to carry out an action or access a resource **Broken Access Control** is a common and often critical vulnerability since access control \[\[1a2a - OWASP TOP 10 2021#4. Insecure Design| design decisions]] have to be made by humans, so the potential for errors is high.

### **Vertical privilege escalation**

if a user can gain access to functionality that they are not permitted to then this is vertical privilege escalation. for example an administrator page from user account. it might be disclosed in `robots.txt` file or can even be brute-forced through [Ffuf](https://github.com/ffuf/ffuf) or [dirb](https://www.kali.org/tools/dirb/) for example.

In some cases, sensitive functionality such as `/administrator-panel` is concealed with less predictable URL(Security by obscurity) such as: `https://insecure-website.com/administrator-panel-yb556`. However, this could be still discovered using URL leaks in code, which can be commonly viewed using `ctrl + u`.

### Parameter-based access control methods

In some cases applications determine user access rights and details at login, and then store them in user-controllable storages:

* A hidden fields
* forgeable cookies(stored on client-side, probably)
* query parameters For example:

```
https://insecure-website.com/login/home.jsp?admin=true
https://insecure-website.com/login/home.jsp?role=1
```

### Horizontal Privilege Escalation

Horizontal Privilege Escalation occurs when an user is able to access other user's resources. It is similar to exploit methods used for Vertical Privilege Escalation.

`https://insecure-website.com/myaccount?id=123`\\

Modifying `id` variable will grant access to other account. This is an example of Insecure Direct Object Reference(IDOR) vulnerability. This happens when user-controlled parameters are used to access resources or functions directly.

In other cases Globally Unique Identifiers(GUIDs) may be used which is harder to predict. However, these values can be disclosed in some other location. Example of GUID:

`/my-account?id=7340df82-31d9-4882-a087-ed4a3a7e4b59`

By changing GUID, an attacker could access other accounts in the same manner as with just id.

### Horizontal to Vertical privilege escalation

a horizontal privilege escalation can be turned to vertical if an attacker can escalate privileges by gaining access to more privileged user, such as an `administrator`. An example:

```
1. http://insecure-website.com/myaccount?id=wiener
2. http://insecure-website.com/myaccount?id=administrator -> on the administrator page
```

### Authentication vulnerabilities

* easy to understand
* critical relationship between authentication and security

| Authentication                                                     | Authorization                                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| <p>process of verifying that a<br>user is who they claim to be</p> | <p>Authorization involves verifying<br>whether a user is allowed to do something</p> |

### Brute-Force Attacks

Websites that use solely password protection, are highly vulnerable to brute-forcing attacks.

brute-forcing need not be based only on random guessing. But also using basic logic, publicly available knowledge and fine-tuned-dictionaries.

**Usernames** are especially easy to guess since they usually follow a certain pattern. For example a business email might look like this `firstname.lastname@somecompany.com`. sometimes even-high privileged accounts are created certain usernames. such as `admin` or `administrator`.

HTTP responses sometimes disclose email addresses of high-privileged users, such as admins or IT support.

**Passwords** can be similarly brute-forced, varying the difficulty based on strength of the password. enforcing high-entropy passwords is a good form of password policy - making it harder to guess. enforcing includes:

* A minimum number of characters
* A mixture of lower and uppercase letters
* At east one special character

high-entropy passwords might be hard to crack, but humans generally follow a certain pattern or knowledge when creating password - often creating a password they can remember - familiar information about a person helps guessing what their credentials might be.

**Username Enumeration** is when an attacker is able to identify whether an username is valid or not based on the changes in the website(on a login page for example.) this makes generating a possible wordlist easier.

Alright, so from the Portswigger Academy lab, I learned how to _enumerate_ [_usernames_](https://portswigger.net/burp/documentation/desktop/testing-workflow/authentication-mechanisms/enumerating-usernames) _and brute-force_ [_passwords_](https://portswigger.net/burp/documentation/desktop/testing-workflow/authentication-mechanisms/brute-forcing-passwords).

1. input the website url
2. add username and password variables in BurpSuite Intruder in response like `username=$user$password=anything`
3. add grep catch for "incorrect username" or something that can identify incorrect usernames
4. run intruder
5. check for different response or status codes
6. same thing for passwords

### Bypassing two-factor authentication

sometimes, two-factor authentication is so flawed, it can be bypassed entirely. Meaning, if the user is logged in and is prompted to enter a verification code, the user in effectively in a "logged in" state already. In this case, you can test if you can skip to "logged-in only" pages after first step of auth. sometimes websites don't check for verification step.

### Server-side request forgery (SSRF)

**Against local systems**

SSRF is a web security vulnerability that allows an attacker to make requests to an unintended location.

In a typical SSRF attack, the attacker might cause the server to make a connection to internal-only services within the organization's infrastructure. In other cases, they may be able to force the server to connect to arbitrary external systems. This could leak sensitive data, such as authorization credentials.

In a SSRF attack against a server, the attacker causes the application to make a HTTP request back to the host server, via its loopback interface, typically `127.0.0.1` or `localhost`.

For example, in a shopping application scenario, user wants to know if a product is in stock, so the browser sends a request through front-end like the following to the back-end API endpoint:

```
POST /product/stock HTTP/1.0 
Content-Type: application/x-www-form-urlencoded 
Content-Length: 118 

stockApi=http://stock.weliketoshop.net:8080/product/stock/check%3FproductId%3D6%26storeId%3D1
```

This, in turn causes the server to make a request to a back-end url, effectively retrieving stock status and returning to the user.

The following is a modified HTTP request:

```
POST /product/stock HTTP/1.0 
Content-Type: application/x-www-form-urlencoded 
Content-Length: 118 

stockApi=http://localhost/admin
```

This fetches the contents of the `/admin` URL and returns it to the user. Usually, administrative functionality is only available through authenticated users. so the only way of having such access to the system, would be to access `/admin` page through local machine - or an _\[\[1a1b - cURL#cURL COOKIES |imitated]]_ one.

This kind of behavior for SSRF to work is possible due to:

* The access control check is implemented on the front-end, so upon making a request, it can bypass a back-end
* For disaster recovery purposes, the application might allow administrative access without login from local machine - kind of a way for an admin to recover the system without credentials.
* Admin interface is listening on different port, and is not accessible from userspace.

Generally, security measures based on _trust_ allow requests to be handled differently, often makes SSRF into a critical vulnerability.
