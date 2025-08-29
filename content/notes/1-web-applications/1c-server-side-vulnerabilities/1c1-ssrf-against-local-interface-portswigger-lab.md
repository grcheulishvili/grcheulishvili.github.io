# 1c1 - SSRF against local interface \[Portswigger Lab]

### **Problem**

```
This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at `http://localhost/admin` and delete the user `carlos`.
```

URL: https://0a4f00b403f04c6c8165a70d000b0073.web-security-academy.net/

### Solution

So each product page has a functionality to check stock for an item. Clicking "Check stock" displays number of items in stock

<figure><img src="/.gitbook/assets/Pasted image 20240718170709.png" alt=""><figcaption><p>Check Stock functionality</p></figcaption></figure>

Upon checking in BurpSuite, the application makes an API call to some `stockApi` URL&#x20;

<figure><img src="/.gitbook/assets/Pasted image 20240718170830.png" alt=""><figcaption><p>BurpSuite - API call for stock check</p></figcaption></figure>

Changing a `stockApi` URL to a `loopback` URL such as `http://localhost/admin` and then sending a request causes the web application to return an admin interface instead of number of stock items.

<figure><img src="/.gitbook/assets/Pasted image 20240718170954.png" alt=""><figcaption><p>admin interface returned</p></figcaption></figure>

Pointing to User `delete` link points to `https://0a4f00b403f04c6c8165a70d000b0073.web-security-academy.net/admin/delete?username=wiener`, so if we modify the HTTP request once again to `stockApi=http://localhost/admin/delete?username=wiener` it will make a `SSRF` call against the local server and issue a command to delete an user 'wiener'

<figure><img src="/.gitbook/assets/Pasted image 20240718171429.png" alt=""><figcaption><p>removing user "weiner"</p></figcaption></figure>
