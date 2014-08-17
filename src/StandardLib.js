/**
 * @created: Sat Jul 19 17:04:28 PDT 2014
 * @author: darryl.west@roundpeg.com
 */
var StandardLib = {};

StandardLib.VERSION = '00.91.005-128';

// fix for lodash
if ( typeof _ === "function" && typeof dash === "undefined") {
    dash = _ ;
}

if (typeof dash.parseBoolean === 'undefined') {
    dash.parseBoolean = function(value, dflt) {
        if (dash.isBoolean( value )) {
            return value;
        }

        if (!dflt) dflt = false;

        if (dash.isUndefined( value )) {
            return dflt;
        }

        if (typeof value === 'string') {
            return (/^true$/i).test( value );
        }

        return dflt;
    };
}

