/**
 *
 *
 * @created: 11/18/13 1:31 PM
 * @author: darryl.west@roundpeg.com
 */
var AppFactory = function(options) {
    "use strict";

    var factory = this,
        dispatcher = null;

    // define underscore/lodash as dash
    if (typeof _ === 'function') {
        window.dash = _ ;
    }

    this.createCentralDispatcher = function() {
        if (!dispatcher) {
            dispatcher = new CentralDispatcher();
        }

        return dispatcher;
    };

    // override this
    this.initialize = function() {

    };
};
