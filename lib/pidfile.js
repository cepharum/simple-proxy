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

const path = require( "path" ),
      fs   = require( "fs" ),
      os   = require( "os" );

var getPidFileName, exists;

/**
 * Selects pathname of PID file according to given set of parsed arguments.
 *
 * @param {ParsedArguments} args
 * @returns {string} pathname of PID file
 */
module.exports.getPidFileName = getPidFileName = function( args ) {
	return args.options.pidFile ||
	       path.join( ( os.tmpdir() || path.dirname( require.main.filename ) ), "simple-proxy.pid" );
};

/**
 * Reads PID from file selected by given set of parsed arguments.
 *
 * @param {ParsedArguments} args
 * @param {function(?Error,?int)=} done
 */
module.exports.readPid = function( args, done ) {
	var filename = getPidFileName( args );

	exists( filename, function( err, stat ) {
		if ( err ) {
			done( err, null );
		} else if ( !stat ) {
			done( null, null );
		} else if ( stat.isFile() ) {
			fs.readFile( filename, function( err, data ) {
				if ( err ) {
					done( err, null );
				} else {
					done( null, parseInt( data.toString().trim() ) || false );
				}
			} );
		} else {
			done( new Error( "PID file is not a file actually" ), null );
		}
	} );
};

/**
 * Write PID to file selected by given set of parsed arguments.
 *
 * @param {ParsedArguments} args
 * @param {number|string} pid
 * @param {function(?Error)=} done
 */
module.exports.writePid = function( args, pid, done ) {
	var filename = getPidFileName( args );

	exists( filename, function( err, stat ) {
		if ( err ) {
			done( err );
		} else if ( stat ) {
			done( new Error( "PID file exists" ) );
		} else {
			fs.writeFile( filename, String( pid ), done );
		}
	} );
};

/**
 * Removes PID file selected by given set of parsed arguments.
 *
 * @param {ParsedArguments} args
 * @param {function(?Error)=} done
 */
module.exports.removePid = function( args, done ) {
	var filename = getPidFileName( args );

	exists( filename, function( err, stat ) {
		if ( err ) {
			done( err );
		} else if ( !stat ) {
			done( null );
		} else if ( stat.isFile() ) {
			fs.unlink( filename, done );
		} else {
			done( new Error( "PID file is not a file actually" ) );
		}
	} );
};

module.exports.exists = exists = function( filename, done ) {
	fs.stat( filename, function( err, stat ) {
		if ( err ) {
			if ( err.code === "ENOENT" ) {
				done( null, null );
			} else {
				done( err, null );
			}
		} else {
			done( null, stat );
		}
	} );
};
