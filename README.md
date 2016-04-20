# simple-proxy
very simple http proxy

## About

This proxy was designed to run from command line without installation. It works 
without elevated privileges and includes tool for starting/stopping proxy as a 
background service. 

## Daemon Control

### Starting

    node simple-proxy/main.js start
    
### Stopping

    node simple-proxy/main.js stop

### Checking

    node simple-proxy/main.js status
