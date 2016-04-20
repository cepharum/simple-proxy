# simple-proxy
very simple http proxy

## About

This proxy was designed to run from command line without installation. It works 
without elevated privileges and includes tool for starting/stopping proxy as a 
background service. 

## Installation

Installation works without elevated privileges. On Unix, Linux and OS X you may
_install_ simple-proxy like this:

	cd ~
    curl http://git.io/n-install | bash
    git clone https://github.com/cepharum/simple-proxy.git

## Daemon Control

### Starting

    node simple-proxy/main.js start
    
### Stopping

    node simple-proxy/main.js stop

### Checking

    node simple-proxy/main.js status
