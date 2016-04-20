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

const fs      = require( "fs" ),
      child   = require( "child_process" ),
      pidFile = require( "./pidfile" );


/**
 * Starts daemon.
 *
 * @param {ParsedArguments} args parsed set of arguments
 * @param {string} daemonModulePathname pathname of JS module to be main module of daemon
 */
module.exports.start = function( args, daemonModulePathname ) {
	pidFile.readPid( args, function( err, pid ) {
		if ( err ) {
			console.error( "failed reading PID file: " + err );
		} else if ( pid ) {
			console.error( "service running already" );
		} else {
			var daemon = child.fork( daemonModulePathname, process.argv, {
				env:    process.env,
				detach: true,
				stdio:  "ignore"
			} );

			pidFile.writePid( args, daemon.pid, function( err ) {
				if ( err ) {
					console.error( "writing PID failed: " + String( error.message || error ) );
					daemon.kill( "SIGHUP" );
				} else {
					daemon.unref();
				}
			} );
		}
	} );
};

/**
 * Stops running daemon.
 *
 * @param {ParsedArguments} args parsed set of arguments
 * @param {StopCallback=} stopperFn
 * @typedef {function(ParsedArguments,number)} StopCallback
 */
module.exports.stop = function( args, stopperFn ) {
	pidFile.readPid( args, function( err, pid ) {
		if ( err ) {
			console.error( "failed reading PID file: " + err );
		} else if ( pid ) {
			if ( typeof stopperFn === "function" ) {
				stopperFn( args, pid )
			} else {
				process.kill( pid, "SIGHUP" );
			}
		} else {
			console.error( "service is not running" );
		}
	} );
};

/**
 * Checks status of daemon.
 *
 * @param {ParsedArguments} args parsed set of arguments
 * @param {StatusCallback=} statusFn
 * @typedef {function(ParsedArguments,number,function(?Error,boolean))} StatusCallback
 */
module.exports.status = function( args, statusFn ) {
	process.exitCode = 1;

	pidFile.readPid( args, function( err, pid ) {
		if ( err ) {
			console.error( "failed reading PID file: " + err );
		} else {
			if ( typeof statusFn !== "function" ) {
				statusFn = fn;
			}

			statusFn( args, pid, function( err, status ) {
				if ( err ) {
					console.error( String( err.message || err ) );
				} else {
					if ( status ) {
						console.error( "service is running" );
						process.exitCode = 0;
					} else {
						console.error( "service is not running" );
					}
				}
			} );
		}
	} );

	/**
	 * @type {StatusCallback}
	 */
	function fn( args, pid, done ) {
		done( null, !!pid );
	}
};

