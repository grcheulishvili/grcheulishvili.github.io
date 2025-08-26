# 1d1 - OS command injection, simple case \[PortSwigger Lab]

This lab contains an OS command injection vulnerability in the product stock checker.

The application executes a shell command containing user-supplied product and store IDs, and returns the raw output from the command in its response.

To solve the lab, execute the `whoami` command to determine the name of the current user.

### Solution:

So we got the application url `https://0a1a008c030d74ae82cb6698003a004a.web-security-academy.net/`

Once again, it has a product page where 'Check stock' function is implemented.

<figure><img src="../../../.gitbook/assets/image (12).png" alt=""><figcaption><p>stock check interface</p></figcaption></figure>

By checking HTPP request made by that button is as follows

```
POST /product/stock HTTP/2
Host: 0a1a008c030d74ae82cb6698003a004a.web-security-academy.net
Cookie: session=SMwTtluydKMmnOH4phL6G00iGAwD2J9Q
Content-Length: 21
Sec-Ch-Ua: "Not/A)Brand";v="8", "Chromium";v="126"
Sec-Ch-Ua-Platform: "Windows"
Accept-Language: en-US
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Accept: */*
Origin: https://0a1a008c030d74ae82cb6698003a004a.web-security-academy.net
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://0a1a008c030d74ae82cb6698003a004a.web-security-academy.net/product?productId=2
Accept-Encoding: gzip, deflate, br
Priority: u=1, i

productId=2&storeId=1
```

on the bottom we got `productId=2&storeId=1` which makes a request to an API with these parameters.

Let's change productID argument to `& echo hello &` but with url encoding enabled

<figure><img src="../../../.gitbook/assets/image (13).png" alt=""><figcaption><p>changing parameters to command injection</p></figcaption></figure>

This request gives out the following output !\[\[Pasted image 20240719183415.png]] although it resulted in error, now we know the username `peter-3vyaW3`

or the second way&#x20;

<figure><img src="../../../.gitbook/assets/image (14).png" alt=""><figcaption><p>another example of command injection</p></figcaption></figure>

which yields the same response:

<figure><img src="../../../.gitbook/assets/image (15).png" alt=""><figcaption><p>retrieved data</p></figcaption></figure>

***
