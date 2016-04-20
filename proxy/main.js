/**
 * (c) 2016 cepharum GmbH, Berlin, http://cepharum.de
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 cepharum GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @author: cepharum
 */

process.on( "exit", proxyShutdown );

const http = require( "http" ),
      net  = require( "net" ),
      url  = require( "url" );

const pidFile = require( "./../lib/pidfile" ),
      args    = require( "./../lib/args" )();


var proxy = http.createServer( localQuery );
proxy.on( "connect", proxyQuery );
proxy.listen( args.options.port || 8080 );

process.on( "SIGINT", function() {
	proxy.close();
} );


function localQuery( req, res ) {
	var url = url.parse( "http://" + req.url, true );

	switch ( url.pathname ) {
		case "/stop" :
			if ( req.socket.address.address === "127.0.0.1" ) {
				success( res );
				proxy.close();
			} else {
				invalidAction( res );
			}
			break;

		case "/status" :
			success( res );
			break;

		default :
			invalidAction( res );
			break;
	}
}

function proxyQuery( req, res, head ) {
	var srvUrl = url.parse( "http://" + req.url );
	var forwarded = net.connect( srvUrl.port, srvUrl.hostname, function() {
		res.write( "HTTP/1.1 200 Connection Established\r\n" +
		           "Proxy-agent: node.js-simple-proxy\r\n" +
		           "\r\n" );
		forwarded.write( head );
		forwarded.pipe( res );
		res.pipe( forwarded );
	} );
}

function invalidAction( res ) {
	res.writeHead( 400, { "Content-Type": "application/json" } );
	res.end( JSON.stringify( { error: "invalid action" } ) );
}

function success( res ) {
	res.writeHead( 200, { "Content-Type": "application/json" } );
	res.end( JSON.stringify( { success: true } ) );
}

function proxyShutdown() {
	pidFile.dropPid( args );
}
