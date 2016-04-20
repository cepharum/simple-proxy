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
    curl -L http://git.io/n-install | bash
    git clone https://github.com/cepharum/simple-proxy.git

## Daemon Control

### Starting

    node simple-proxy/main.js start
    
Proxy is listening on port `8080` by default. You may choose different one using
argument:

    node simple-proxy/main.js start --port=5432

### Stopping

    node simple-proxy/main.js stop
    
This will send `SIGHUP` to daemon given in PID file. If PID file is orphan or if
daemon does not shut down on `SIGHUP` you may use force to kill the process and
remove any PID file.

    node simple-proxy/main.js stop --force

### Checking

    node simple-proxy/main.js status
