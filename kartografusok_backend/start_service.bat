SCHTASKS /CREATE /SC WEEKLY /D WED /TN "Server\Promote" /TR "%~dp0promote.bat" /ST 15:48