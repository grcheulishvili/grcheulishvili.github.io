# 1a - Web Requests

In this module, I learned that [HTTP](https://datatracker.ietf.org/doc/html/rfc2616#autoid-1) is an application-level protocol used to exchange information between information systems.

This protocol works in a request-response mode.

It has 8 request types:

* GET - Requests a specific resource from the server
* [HEAD](1a1-http-requests.md) - Requests only general data
* POST - Requests to process the sent information and return the corresponding response
* PUT - Requests to upload the sent information
* DELETE - Requests to delete existing information from the server
* CONNECT - This term is reserved for future versions of HTTP
* TRACE - Requests feedback from the server regarding the status of the information
* OPTIONS - Requests information about the connection to the server

The response has **status codes** that reflect information about the satisfaction of the request. It provides a short text description using a 3-digit status code. The status code is used by the computer and the text description is used by a human.

Status codes:

* 1xx - Informational
  * 100 Continue
  * 101 Switching Protocols
* 2xx - Successful
  * 200 OK
  * 201 Created
  * 202 Accepted
  * 203 Non-Authoritative Information
  * 204 No Content
  * 205 Reset Content
  * 206 Partial Content
* 3xx - Redirect
  * 300 Multiple Choices
  * 301 Moved Permanently
  * 302 Found
  * 303 See Other
  * 304 Not Modified
  * 305 Use Proxy
  * 306 Unused
  * 307 Temporary Redirect
* 4xx - Client Error
  * 400 Bad Request
  * 401 Unauthorized
  * 402 Payment Required\\
  * 403 Forbidden
  * 404 Not Found
  * 405 Method Not Allowed
  * 406 Not Acceptable
  * 407 Proxy Authentication Required
  * 408 Request Timeout
  * 409 Conflict
  * 410 Gone
  * 411 Length Required
  * 412 Precondition Failed
  * 413 Request Entity Too Large
  * 414 Request-URI Too Long
  * 415 Unsupported Media Type
  * 416 Requested Range Not Satisfiable
  * 417 Expectation Failed
* 5xx - Server Error
  * 500 Internal Server Error
  * 501 Not Implemented
  * 502 Bad Gateway
  * 503 Service Unavailable
  * 504 Gateway Timeout
  * 505 HTTP Version Not Supported
