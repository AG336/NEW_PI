READ.ME

Hello! This is a READ.ME script for a laser system that uses Henlab and communicates through a Raspberry Pi. 

Description

This project provides a basic sructure to control multiple USB and Ethernet devices from a Raspberry Pi 3 model B running Raspbian.

## Context

This project has been developed to control multiple devices as part of a collaboration between the HenLab at MIT Laboratory of Nuclear Science and JLab. This project was developed by Pedro F. Toledo. Changes and updates made by Alexander Garrett at ODU.

This project uses some basic Serial, LXI, Apache and PHP technologies to provide a web-server that allows to centralyze the control of multiple USB and Ethernet devices through a simple web-site. You can go to github to pull the orginial code @ https://github.com/AG336/raspberryPI 
## Extension

This project has been modularized so it can be eventually used for other purposes that involve the control centralization of multiple devices through a single tcp/ip link.

## How to use this WIKI

Here you will find the information required to set-up this software on your Raspberry Pi. The wiki is made of different sequential stages. If you got questions... do not hesitate to ask!


=== 00 = Setting Up the RP ===

The [Raspberry Pi](https://www.raspberrypi.org)(RP) is the central controlling unit for the RPControlHub. This set-up currently uses the [Raspberry Pi Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/).

To start, it is required to install the OS on the device by installing it on a MicroSD card that will be installed on the RP. For this set-up, the Debian based OS named Raspbian has been chosen; therefore, go to the [Raspian Download Page](https://www.raspberrypi.org/downloads/raspbian/) and get the "Raspbian Stretch Lite" version. This will download a `.zip` file to your computer that contains a `.img` file. Unzip to get the `.img` file.

To install the OS on a MicroSD you need to write the `.img` file on it. Take a MicroSD card (at least 8GB total memory, it will be completely erased) and follow the instructions from [here](https://www.raspberrypi.org/documentation/installation/installing-images/README.md): Basically, you will need to start by downloading the software named [Etcher](https://etcher.io/) (It is compatible with Linux, Windows or Mac) and install it on your PC. Connect the MicroSD to your PC and open Etcher, select the `.img` file and the MicroSD and then click on Flash. It will take about 4 minutes to install and validate the installation.

For security reasons, Raspbian by default comes with SSH disabled. To solve this, open a terminal and run:
```
cd /Volumes/boot/
touch ssh
```
Remove safely the MicroSD and now, with the Raspbian installation ready, take the SD Card and install it on the RP inside the case.

You can enable the ssh through the pi as well by placing the sd card in the pi and running this line.

sudo raspi-config
This should pull up a menu
go to INTERFACING OPTIONS 
SSH
ENABLE

=== 01 = Installing Base SW ===

To install the base software required for this application, log in to the RP and run:
```
First run the update the pi system needs to run first (this takes a little bit of time to happen but will appear next to the bluetooth symbol)
sudo apt-get update 
sudo apt-get upgrade
sudo apt-get install vim
sudo apt-get install git
sudo apt-get install python3-pip
sudo apt-get install python3-vxi11
sudo apt-get install -y nodejs
sudo apt-get install php-mysql 
pip3 install mysql-connector-python 
pip install numpy
pip install matplotlib
sudo apt-get install apache2 php libapache2-mod-php -y
sudo apt-get install snapd
sudo reboot

Then reconnect to the RP and run:

sudo snap install lxi-tools
```
=== 02 = Conf. RP Net. Interf. ===

The Raspberry Pi Model B (RP) has both cable connection and wifi connection. For security reasons we will only configure the access through cable.

To configure the cable interface (Instruction for OSx):
1. Turn on the case
1. Connect you PC to the RP with a direct cable
1. Activate internet sharing to your PC
1. Run `ping raspberrypi.local` to get your **<RP_IP>**
1. Connect to your RP with: `ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no pi@<RP_IP>` with the password **raspberry**
1. Once you are connected, change the default login password with the command `passwd`
1. When connected to a control network you will typically have fix IP address or a DHCP assigned IP. If you know your fix IP you can skip this step, otherwise we need to configure a easy way to reach the RP with the following procedure:
    1. Go to [noip.com](https://www.noip.com/) and create an account
    1. Create a new hostname
    1. Go to the RP and run the following lines (When requested set _update time_ to 1)
        ```
        cd
        wget http://www.no-ip.com/client/linux/noip-duc-linux.tar.gz
        tar xf noip-duc-linux.tar.gz
        cd noip-2.1.9-1/
        sudo make install
        cd /etc/init.d/
        sudo wget https://raw.githubusercontent.com/ptoledo/RPControlHub/master/reference/noip2
        sudo chmod 755 noip2
        sudo update-rc.d noip2 defaults
        ```
    1. Turn off the RP (`sudo halt`)
    1. Connect the ethernet cable to the control network
    1. Turn on the RP
1. Edit your `~/.ssk/known_hosts` file and delete the line that has the **<RP_IP>** you previously used

To be able to connect with certain devices, the RP uses a USB/Ethernet adapter that needs to be configured to generate a internal network. To do this:
1. Edit the the dhcpcd.conf file with `sudo vim /etc/dhcpcd.conf`
2. Add the following lines:
```
# HenLab Experiment Configuration
interface eth1
static ip_address=192.168.42.10/24
```
Then reboot the RP with `sudo reboot`, reconnect and check that the **eth1** interface is correctly set to the IP **192.168.42.10**.

=== 03 = Conf. RP SSH ===

For security reasons, the RP should be configured to only accept symmetric keys for login. To configure this setting you should execute the following procedure:

1. On your local computer run `ssh-keygen -t rsa -b 4096 -C pi` to create a key
1. Run `chmod 600 <keyname>*` to set the correct key permissions (**<key_name>** is the name of the key when you execute the previous command)
1. Connect to your RP with: `ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no pi@<RP_ADDRESS>` with the new password you set previously and with **RP_ADDRESS** the fix IP provided by the control network or the address from the DDNS service
1. Create a `.ssh` folder with
    1. `cd`
    1. `mkdir .ssh`
1. Inside the `.ssh` folder create a file named `authorized_keys`
1. Edit `authorized_keys` and add the content of you `.pub` key you generated on the first step
1. Exit the RP
1. Confirm that the configuration is ok by connecting to the RP with `ssh -i /path/to/key pi@<RP_ADDRESS>`. You should be able to login without providing a password

Now the the login by keys is ready, we need to disable the access with passwords. To do this:
1. Open the sshd_config file with `sudo vi /etc/ssh/sshd_config`
1. Find the line `#PasswordAuthentication yes` (~line 56) and change it by the lines: `PasswordAuthentication no`, `ChallengeResponseAuthentication no`, `UsePAM no`
1. Save and reboot the RP with `sudo reboot`
1. Wait for the RP to initialize again and try to connect using password (`ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no pi@<RP_ADDRESS>`). You should get a `Permission denied (publickey)` message
1. Retry connecting with `ssh -i /path/to/key pi@<RP_ADDRESS>`. You should be able to get in without putting a password
=== 04 = Conf. Apache ===

Edit the Apache default config file with:

`sudo vim /etc/apache2/sites-enabled/000-default.conf`

And add the following text just before the line `</VirtualHost>`:

```
<Directory "/var/www/html">
   AuthType Basic
   AuthName "Restricted Content"
   AuthUserFile /etc/apache2/.htpasswd
   Require valid-user
</Directory>
```
Then, create a username and passwrod to access the server with:
```
sudo htpasswd -c /etc/apache2/.htpasswd <username>
```
Finally, restart the Apache server to load the new configuration with:
```
sudo service apache2 restart
```

=== 04 = Conf. Devices ===

# Attenuator

The attenuator only requires to be connected to the righ bottom USB port. The serial port configuration is automatic.

# Laser

The laser only requires to be connected to the right upper USB port. The only required configuration is setting the `cron` to permanently log temperatures. To do this, run `crontab -e` and add the following line to the end of the file:
```
* * * * * /var/www/html/runLaserTemps
```

# Signal Generator

This set-up uses the device: Siglent SDG 1032X. For its configuration it is required to specify the IP address for the device:
1. Go to Utility->Page 2->interface
1. Enable the "LAN State"
1. Go to LAN Setup
1. Set the following configuration parameters:
```
IP Address:  192.168.42.11
Subnet Mask: 255.255.255.0
Gateway:     192.168.42.1
```
To use the Signal Generator from the web-interface we need to allow the www-data user to run commands as pi. To do this, we run the command `sudo visudo` and add the following lines to the end:
```
Defaults:www-data !requiretty
www-data ALL=(pi) NOPASSWD: ALL
```
To avoid some warning messages related to depending libraries, edit **ld.so.preload** with `sudo vim /etc/ld.so.preload` and change the line `/usr/lib/arm-linux-gnueabihf/libarmmem.so` by just deleting the whole line and saving the script. 

=== 05 = Install RPControlHub ===

To install the software run:
```
cd /var/www
sudo rm -rf html
sudo git clone https://github.com/AG336/NEW_PI/tree/main/raspberryPI-master html
cd html
sudo chown pi:pi -R . .git *.*

=== 06 = Script that need change ===

# Attenuator

Will have to change line the ser.port in the laserServer_devices_atten.py!!!
you can do 
cd /dev/serial/by-path 
dir 
this will let you know what ser.port the attenuator is using !!!
*easier if you only plug the attenuator in first 

# Laser

!!! Will need to change line ser.port in the laserServer_devices_laser.py!!!
cd /dev/serial/by-path 
dir 
this will let you know what the laser is on. You should see the one you used for the attenuator and the laser!!!
* if you don't see anything or two as a response this means your connection is wrong.

# Laser Server linking 

In the laserServer.service script there is a way to link this page follow the steps at the bottom of this script

# MYSQL info
 
you can use phpmyadmin through the web page address bar type in  RP IP/phpmyadmin.
This will allow you to access the mysql and all the tables and content. 

Username: phpmyadmin
Password: pi 
DB: henlablaser

four different pages that connect to  mysql  
laserAccess.php
laserQueue.php  (has two stops)
laserServer_config.py
laserServer.php

 

 === 07 = How to Start the Server ===

This is the line that needs to be ran to start the laserServer otherwise it won't run 

 sudo systemctl start laserServer

=== 08 = Suggestions on set up ====

install screen and netcat
Screen will allow you to talk to the devices thought the pi (just need to know the port the device is on)
Netcat will allow you to talk to the generator.

# Laser
If using the MLC-03A-DPI laser you will need to have a RS323 cable that connects to a null adaptor.

# Attenuator
you can use a RS-323 cable with either a prolific chip or an FTDI

# Wave Generator
For the wave generator. If you want to make sure the connection is correct. you have to use netcat to talk to the device. It will be on port 5025.  


