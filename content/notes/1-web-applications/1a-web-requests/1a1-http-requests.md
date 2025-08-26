# 1a1 - HTTP requests

HTTP headers are used to transfer information from the client or server.&#x20;

The client function can be implemented by the [cURL ](1a2-curl.md)program, which is a good tool for pentesting.&#x20;

We have the following categories of headers

* General Headers
* Entity Headers
* Request Headers
* Response Headers
* Security Headers

**`General Headers`** are used to describe the message, not its content. They are found in HTTP requests and responses.

| Header     | Example                             | Description                                                                                                        |
| ---------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Date       | Date: Wed, 16 Feb 2022 10:38:44 GMT | Message creation date                                                                                              |
| Connection | Connection: Keep-Alive              | Determines whether the connection should remain open or be closed with the following tags: `close` or `Keep-Alive` |

**`Entity Headers`** are used to describe the content of a message and are found in POST and PUT headers.

| Header           | Example                     | Description                                                                |
| ---------------- | --------------------------- | -------------------------------------------------------------------------- |
| Content-Type     | Content-Type: text/html     | Describes the type of resource being transferred.                          |
| Media-Type       | Media-Type: application/pdf | Similar to the content type, but directly conveys the type of information. |
| Boundary         | boundary="b4e4fbd93540"     | Used to separate multiple pieces of data in a single message.              |
| Content-Length   | Content-Length: 385         | Contains the size of the information to be transmitted.                    |
| Content-Encoding | Content-Encoding: gzip      | It transmits a way of encoding information.                                |

[`Request Headers`](https://datatracker.ietf.org/doc/html/rfc7231#autoid-42) are used for HTTP requests and has no connection to the content of the information. It has the following headers

| Header        | Example                                | Description                                                                                                                                                                                                                                                                                                            |
| ------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host          | Host: www.inlanefreight.com            | Describes the address of the server to which the request is sent.                                                                                                                                                                                                                                                      |
| User-Agent    | User-Agent: curl/7.77.0                | It is used to describe the client agent. This header can be used to determine what program the client is using to connect to the server.                                                                                                                                                                               |
| Referer       | Referer: http://www.inlanefreight.com/ | Describes where the current demand is coming from.                                                                                                                                                                                                                                                                     |
| Accept        | Accept: \*/\*                          | Describes what types of information the client can accept. `*`_`/`_`*` means all types of data are allowed.                                                                                                                                                                                                            |
| Cookie        | Cookie: PHPSESSID=b4e4fbd93540         | A cookie record consists of a name=value pair. It is data that is stored on the client and server and serves as an identifier. It is sent to the server on each request to identify the client. It can also be used for session tracking. Multiple cookies can be contained in one header and are separated by a `;` . |
| Authorization | Authorization: BASIC cGFzc3dvcmQK      | One way to identify a client. After authentication, the server assigns the client a unique token, which is stored on the client side and will be retrieved by the server on each request.                                                                                                                              |

`Response Headers` are used in the HTTP response header and is also unrelated to context. Age, location, and server data are used in the response header to create context.

| Header           | Example                                   | Description                                               |
| ---------------- | ----------------------------------------- | --------------------------------------------------------- |
| Server           | Server: Apache/2.2.14 (Win32)             | Contains information about the server                     |
| Set-Cookie       | Set-Cookie: PHPSESSID=b4e4fbd93540        | Contains a cookie record about the user.                  |
| WWW-Authenticate | WWW-Authenticate: BASIC realm="localhost" | Informs the client about the possible authentication type |

`Security Headers` are used to set rules and policies for the browser.

| Header                    | Example                                     |
| ------------------------- | ------------------------------------------- |
| Content-Security-Policy   | Content-Security-Policy: script-src 'self'  |
| Strict-Transport-Security | Strict-Transport-Security: max-age=31536000 |
| Referrer-Policy           | Referrer-Policy: origin                     |
