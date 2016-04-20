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
 * @typedef {object} ParsedArguments
 * @property {object<string,(null|string|boolean)>} options set of options and related arguments
 * @property {string[]} parameters set of non-option arguments
 */

/**
 * Parses provided arguments or arguments of current process returning separated
 * sets of options and parameters.
 *
 * Any detected long-option may take argument either using assignment or space
 * for separator. Short-options may take argument if there is a mapping to some
 * long-option in `shortToLong`. `--` is supported to stop processing options
 * and collecting any succeeding argument as such.
 *
 * Options without argument are tracked with value `true` internally. By
 * assigning no value to some long-option it's internally tracked value is
 * `undefined`.
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
		ptnLongOption = /^--([^=]+)(=(.*))?$/,
		ptnShortOption = /^-(.+)$/,
		recentOptionName;


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
					parsed.options[option[1]] = option[2] ? option[3] : true;

					if ( !option[2] ) {
						recentOptionName = option[1];
					}
				} else {
					option = ptnShortOption.exec( arg );
					if ( option ) {
						option[1].split( "" )
							.forEach( function( name ) {
								if ( shortToLong.hasOwnProperty( name ) ) {
									name = shortToLong[name];
									recentOptionName = name;
								}

								parsed.options[name] = true;
							} );
					} else if ( recentOptionName ) {
						parsed.options[recentOptionName] = arg;
						recentOptionName = null;
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
