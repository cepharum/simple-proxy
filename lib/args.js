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

/**
 * @typedef {{options: object<string,(null|string|boolean)>, parameters: string[]}} ParsedArguments
 */

/**
 * Parses provided arguments or arguments of current process returning separated
 * sets of options and parameters.
 *
 * @param {string[]=} args arguments to use explicitly
 * @param {object<string,string>=} shortToLong mapping of short options into long names
 * @returns ParsedArguments
 */
module.exports = function( args, shortToLong ) {
	var allowOptions = true,
	    parsed       = {
		    options: {},
		    parameters: []
	    },
		ptnLongOption = /^--([^=]+)(=(.*))$/,
		ptnShortOption = /^-(.+)$/;


	if ( !Array.isArray( args ) ) {
		if ( args && typeof args === "object" && !shortToLong ) {
			shortToLong = args;
			args = null;
		}

		args = process.argv.slice( 2 );
	}

	shortToLong = shortToLong || {};


	if ( Array.isArray( args ) ) {
		args.forEach( function( arg ) {
			if ( allowOptions ) {
				if ( arg == "--" ) {
					allowOptions = false;
					return;
				}

				var option = ptnLongOption.exec( arg );
				if ( option ) {
					parsed.options[option[1]] = option[2] ? option[3] : null;
				} else {
					option = ptnShortOption.exec( arg );
					if ( option ) {
						option[1].split( "" )
							.forEach( function( short ) {
								if ( shortToLong.hasOwnProperty( short ) ) {
									parsed.options[shortToLong[short]] = true;
								} else {
									parsed.options[short] = true;
								}
							} );
					} else {
						parsed.parameters.push( arg );
					}
				}
			} else {
				parsed.parameters.push( arg );
			}
		} );
	}

	return parsed;
};
