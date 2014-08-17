/**
 * @class AppFactory
 *
 * @created: 11/18/13 1:31 PM
 * @author: darryl.west@roundpeg.com
 */
var AppFactory = function(options) {
    "use strict";

    var factory = this,
        dispatcher = null;

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
