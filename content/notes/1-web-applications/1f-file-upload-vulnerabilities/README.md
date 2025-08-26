# 1f - File Upload Vulnerabilities

FUV is when a web server allows to upload files to its filesystem without proper validation - like their name, type, contents or size. Failing to fulfil these could cause an attacker to upload arbitrary and potentially dangerous file instead of image for example - this includes server-side script files that enable RCE.

In some cases, the act of uploading the file in itself can cause damage, in others - it may involve payload over HTTP

Given fairly clear dangers of FUV, developers commonly implement protection mechanisms, however developers also commonly implement what is believed to have robust validation mechanisms that is easily flawed or can be easily bypassed.

* Blacklisting dangerous file types is not enough - it may not work in case filename is obfuscated
* checking file attributes is not enough - file attributes can be easily manipulated

From a _security perspective_ the worst case would be if a website allows server-side script uploads such as Python, PHP, Ruby and is configured to run them as code. In this case it is easy to deploy a _Web Shell_.

Web Shell is a script that allows an attacker to execute arbitrary commands on a remote server by simply sending HTTP requests to the right endpoint.

_An ability to upload a web shell, effectively leads to full control over the server._

following PHP one-liner could be used to read files from the server's filesystem:

`<?php echo file_get_contents('/path/to/target/file'); ?>`

Once uploaded, sending a request for this malicious PHP script will return file's contents in the response.

A more versatile web shell version:

`<?php echo system($_GET['command']); ?>`

This script allows to pass an arbitrary system command through query parameters as follows:

`GET /example/exploit.php?command=id HTTP/1.1`
