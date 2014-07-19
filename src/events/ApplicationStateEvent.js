/**
 * ApplicationStateEvent - fired during startup to specifiy the application's state.  Generally, the sequence goes
 * from configuration to ready to start.
 *
 * @author darryl.west@roundpeg.com
 */
var ApplicationStateEvent = function( type, data ) {
    'use strict';

    this.type = type;
    this.data = data;
};

ApplicationStateEvent.CONFIGURATION_READY = 'ConfigurationReadyEvent_ApplicationStateEvent';
ApplicationStateEvent.APPLICATION_READY = 'ApplicationReadyEvent_ApplicationStateEvent';
ApplicationStateEvent.APPLICATION_START = 'ApplicationStartEvent_ApplicationStateEvent';

ApplicationStateEvent.createConfigurationReadyEvent = function(conf) {
    'use strict';
    return new ApplicationStateEvent( ApplicationStateEvent.CONFIGURATION_READY, conf );
};

ApplicationStateEvent.createApplicationReadyEvent = function(obj) {
    'use strict';
    return new ApplicationStateEvent( ApplicationStateEvent.APPLICATION_READY, obj );
};

ApplicationStateEvent.createApplicationStartEvent = function(obj) {
    'use strict';
    return new ApplicationStateEvent( ApplicationStateEvent.APPLICATION_START, obj );
};

