# 1d - OS command injection

Also known as _shell injection_. Allows an attacker to execute operating system commands on the server that is running a web application - typically compromises the application and its data.

An attacker can leverage an OS command injection vulnerability to compromise other parts of the hosting infrastructure and exploit trust relationship to pivot the attack to other systems as well.

some informational commands

| Purpose of command    | Linux       | Windows       |
| --------------------- | ----------- | ------------- |
| Name of current user  | whoami      | whoami        |
| Operating system      | uname -a    | ver           |
| Network configuration | ifconfig    | ipconfig /all |
| Network connections   | netstat -an | netstat -an   |
| Running processes     | ps -ef      | tasklist      |

### **An example**

An application allows an user to see whether an item is in stock or not. It's accessed through a URL:

`https://insecure-website.com/stockStatus?productID=381&storeID=29`

To provide the stock data, the application must query various legacy systems. and because of this, functionality is implemented by calling out to a shell command with the product and store IDs as arguments.

`stockreport.pl 381 29`

The command outputs the stock status for specified item.

The application implements no defense mechanisms against OS injection, so the following command executes an arbitrary command on the system

`& echo aiwefwlguh &`

supposing this is in the `productID` parameter, the command executed by the application would be:

`stockreport.pl & echo aiwefwlguh & 29`

`stockreport.pl` - main script that will be running to check stock data `&` - shell command separator. used to separate commands to execute one after another `echo aiwefwlguh` - an argument for `productID`. prints `aiwefwlguh` `29` - storeID parameter
