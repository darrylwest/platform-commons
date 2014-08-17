/**
 * MockServiceFactory -
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2/18/14 1:37 PM
 */
var MockServiceFactory = function(options) {
    'use strict';

    var mock = this,
        agent; // = new MockAjax();

    if (!options) options = Config.test();

    // if (!options.agent) options.agent = mockAgent;

    if (!options.log) options.log = new RemoteLogger('MockServiceFactory', RemoteLogger.ERROR);
    if (!options.dispatcher) options.dispatcher = new CentralDispatcher();

    options.createLogger = function(name) {
        return new RemoteLogger( name, RemoteLogger.ERROR );
    };

    ClassExtender.extend( new ServiceFactory( options ), this );
};
