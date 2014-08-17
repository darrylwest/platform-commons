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

/**
 *
 * @created: 12/26/12 2:54 PM
 * @author: darryl.west@roundpeg.com
 */
var AuthenticationEvent = function( type, data ) {
    'use strict';

    this.type = type;
    this.data = data;
};

AuthenticationEvent.SUCCESS = 'AuthenticationSuccess_AuthenticationEvent';
AuthenticationEvent.FAILED = 'AuthenticationFailed_AuthenticationEvent';
AuthenticationEvent.SERVICE_FAIL = 'ServiceFailed_AuthenticationEvent';

AuthenticationEvent.createSuccessEvent = function( user ) {
    'use strict';
    return new AuthenticationEvent( AuthenticationEvent.SUCCESS, user );
};

AuthenticationEvent.createFailedEvent = function( reason ) {
    'use strict';
    return new AuthenticationEvent( AuthenticationEvent.FAILED, reason );
};

AuthenticationEvent.createServiceFailed = function( reason ) {
    'use strict';
    return new AuthenticationEvent( AuthenticationEvent.SERVICE_FAIL, reason );
};
/**
 * BaseModel is used as the base for models that are persisted to the database.  Use ClassExtender to extend.
 *
 * @created: 4/1/13 10:52 AM
 * @author: darryl.west@roundpeg.com
 */
var BaseModel = function(params) {
    "use strict";
    if (!params) params = {};

    // work-around for grails/mongo ids
    if ( params._id ) {
        params.id = params._id;
    }

    this.id = params.id;
    this.dateCreated = params.dateCreated;
    this.lastUpdated = params.lastUpdated;
    this.version = params.version === undefined ? 0 : params.version;
};
/**
 * NumericRangeModel - container for named min/max numbers.  verifies that a number is inclusively between the specified
 * min and max range.
 *
 * @created: 5/5/13 8:25 PM
 * @author: darryl.west@roundpeg.com
 */
var NumericRangeModel = function(params) {
    "use strict";

    var range = this;

    if (!params) params = {};

    this.name = params.name || 'unknown';
    this.min = typeof params.min === 'number' ? params.min : Number.MIN_VALUE;
    this.max = typeof params.max === 'number' ? params.max : Number.MAX_VALUE;

    /**
     * specify a method that can be invoked when a value is between min and max
     */
    this.callbackMethod = params.callbackMethod;

    /**
     * returns true if 'n' is inclusively between min and max
     */
    this.isBetween = function(n) {
        return range.min <= n && n <= range.max;
    };
};
/* global ClassExtender, BaseModel */
/**
 * User - extends basic model with token, display name, email, dealer number, dealer name, region and status; also
 * adds validation methods
 */

var User = function( params ) {
    "use strict";
    if (!params) params = {};

    ClassExtender.extend( new BaseModel( params ), this );

    this.ip = params.ip;
    this.token = params.token;
    this.username = params.username;
    this.attributes = params.attributes;
    this.status = params.status;
};

User.ACTIVE = 'active';
User.INACTIVE = 'inactive';
User.BANNED = 'banned';/**
 * FileLoadService - a simple file reader service intended to read partial HTML pages.
 *
 * @created: 12/5/13 1:49 PM
 * @author: darryl.west@roundpeg.com
 */
var FileLoadService = function(options) {
    "use strict";

    var service = this,
        log = options.log || RemoteLogger.createLogger( 'FileLoadService' ),
        ajax = options.ajax,
        dataType = options.dataType || 'html';

    this.load = function(url, successHandler, failHandler) {
        log.info( 'file load: ', url);

        if ( !failHandler ) {
            failHandler = service.failHandler;
        }

        var obj = {
            type:'GET',
            dataType:dataType,
            url:url,
            cache:false,
            success:successHandler,
            error:failHandler
        };

        return ajax( obj );
    };

    this.failHandler = function( event ) {
        var msg = [ 'Error Loading File!, status: ',
            event.status,
            ', message: ',
            event.statusText
        ].join('');

        log.error( msg );
        // alert( msg );
    };

    // constructor tests
    if ( !ajax )  throw new Error( "service must be constructed with an ajax object" );
};
/**
 * @class MessageService
 * @classdesc Subscribe to a channel; distribute messages to listeners when they arrive
 *
 * @copyright Copyright &copy; 2014 Waterous
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/1/14 11:43 AM
 */
var MessageService = function(options) {
    'use strict';

    var service = this,
        log = options.log,
        client = options.client,
        channel = options.channel,
        uid = options.uid,
        subscribed = false,
        listeners = [];

    /**
     * add a subscriber/listener to this message stream
     *
     * @param listener - function( message )
     */
    this.addSubscriber = function(listener) {
        if (!subscribed) {
            log.info('subscribe to channel: ', channel);
            client.subscribe( channel, messageHandler );

            client.then(function() {
                log.info( 'subscription to ', channel, ' accepted...' );
            });

            subscribed = true;
        }

        log.info('add listener to channel: ', channel);
        listeners.push( listener );
    };

    var messageHandler = function(message) {
        log.debug('gauge message: ',  message );

        listeners.forEach(function(listener) {
            listener( message );
        });
    };

    /**
     * publish message (model) to the channel by wrapping in the standard wrapper
     *
     * @param model - data to publish
     */
    this.publish = function(model) {
        var msg = {
            ts:Date.now(),
            version:'1.0',
            message:model
        };

        if (uid) {
            msg.uid = uid;
        }

        if (channel !== '/logger') {
            log.info('publish message: ', msg);
        }

        client.publish( channel, msg );
    };

    // constructor validations
    if ( !log ) {
        throw new Error( 'service must be constructed with a logger' );
    }

    if ( !client ) {
        throw new Error( 'service must be constructed with a socket client' );
    }

    if ( !channel ) {
        throw new Error( 'service must be constructed with a channel' );
    }
};/**
 * QueryService - a simple service to read json config or other files for a single listener.
 *
 * @created: 12/5/13 1:40 PM
 * @author: darryl.west@roundpeg.com
 */
var QueryService = function( options ) {
    "use strict";

    var service = this,
        name = options.name,
        log = options.log || RemoteLogger.createLogger( name + 'QueryService' ),
        url = options.url,
        ajax = options.ajax,
        dataType = options.dataType || 'json';

    this.query = function( params, successHandler, failHandler ) {
        log.info( 'query: ', name, ', url: ', url );

        if ( !failHandler ) {
            failHandler = service.failHandler;
        }

        var obj = {
            type: 'GET',
            dataType: dataType,
            url: url,
            data: params,
            cache: false,
            success: successHandler,
            error: failHandler
        };

        return ajax( obj );
    };

    this.failHandler = function( event ) {
        var msg = [ 'Query Service Error!, status: ',
            event.status,
            ', message: ',
            event.statusText
        ].join('');

        log.error( msg );
        // alert( msg );
    };

    // constructor tests
    if ( !ajax )  throw new Error( "service must be constructed with an ajax object" );
    if ( !url ) throw new Error('service requires a url');
};
/**
 * @class RemoteService
 *
 * @copyright Copyright &copy; 2014 Waterous
 *
 * @author: darryl.west@roundpeg.com
 * @created: 5/20/14 7:20 PM
 */
var RemoteService = function(options) {
    'use strict';

    var service = this,
        log = options.log,
        agent = options.agent,
        host = options.host,
        uri = options.uri,
        resource = options.resource,
        appkey = options.appkey,
        usekey = options.usekey,
        timeout = dash.isNumber( options.timeout ) ? options.timeout : 10000;

    /**
     * query for a list of models
     *
     * @param params - query criteria
     * @param successHandler
     * @param failHandler
     * @returns the request object
     */
    this.query = function(params, successHandler, failHandler) {
        var url = [ host, uri, resource, '/query' ].join('' ),
            request;

        if (!failHandler) {
            failHandler = service.defaultFailHandler;
        }

        if (!successHandler) {
            log.warn('using default success handler');
            successHandler = service.defaultSuccessHandler;
        }

        log.info('query the service at: ', url);

        request = agent.get( url ).set( 'Accept', 'application/json' );
        request.timeout( timeout );

        if (usekey) {
            request.set( 'X-API-Key', appkey );
        }

        request.end( function(err, result) {
            if (err) {
                log.error( err.message );
                return failHandler(err);
            }

            successHandler( result );
        });

        return request;
    };

    /**
     * save (insert/update) the data model defined by the request
     *
     * @param request - the data model object to be sent to the server
     * @param successHandler -
     * @param failHandler
     */
    this.save = function(model, successHandler, failHandler) {
        var url = [ host, uri, resource, '/save' ].join('' ),
            request;

        if (!failHandler) {
            failHandler = service.defaultFailHandler;
        }

        if (!successHandler) {
            log.warn('using default success handler');
            successHandler = service.defaultSuccessHandler;
        }

        log.info('save the model with request: ', model, ' from url: ', url);

        request = agent.put( url ).set( 'Accept', 'application/json' );
        request.timeout( timeout );

        if (usekey) {
            request.set( 'X-API-Key', appkey );
        }

        request.end( function(err, result) {
            if (err) {
                log.error( err.message );
                return failHandler(err);
            }

            successHandler( result );
        });

        return request;
    };

    /**
     * find the single data model
     *
     * @param id - the model's unique identifier
     * @param successHandler
     * @param failHandler
     * @returns the request object
     */
    this.find = function(id, successHandler, failHandler) {
        var url = [ host, uri, resource, '/find/', id ].join('' ),
            request;

        if (!failHandler) {
            failHandler = service.defaultFailHandler;
        }

        if (!successHandler) {
            log.warn('using default success handler');
            successHandler = service.defaultSuccessHandler;
        }

        log.info('find the model with url: ', url);

        request = agent.get( url ).set( 'Accept', 'application/json' );
        request.timeout( timeout );

        if (usekey) {
            request.set( 'X-API-Key', appkey );
        }

        request.end( function(err, result) {
            if (err) {
                log.error( err.message );
                return failHandler(err);
            }

            successHandler( result );
        });

        return request;
    };

    this.defaultSuccessHandler = function(response) {
        log.info('response: ', response.text);
    };

    this.defaultFailHandler = function(err) {
        log.error( err );
    };

    // constructor validations
    if ( !log ) {
        throw new Error( 'service must be constructed with a logger' );
    }
};

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 */
var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c3 = 0;
        var c2 = 0;
        var c = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
};
/**
 * CentralDispatcher - Event and Method dispatcher
 *
 * @version 2013.03.31-14023 - removed console log to enable in IE
 * @version 2013.05.03-14025 - modified addMethod to throw error on duplicate
 *                           - added listMethodNames method to list all
 * @version 2013.05.16-14452 - added invokeLater
 *
 * @author darryl.west@roundpeg.com
 */
var CentralDispatcher = function() {
    'use strict';

    var dispatcher = this,
        listeners = {},
        methods = {};

    /**
     * Add a method/closure to the dispatcher.  Methods may only be added once; subsequent attempts to add the same
     * method will throw an error.
     *
     * @param id - the unique signature for this method
     * @param closure - the implementing function
     * @returns dispatcher to enable chaining
     */
    this.addMethod = function( id, closure ) {
        if (id && typeof closure === 'function') {
            if (methods.hasOwnProperty( id )) {
                throw new Error("Method Override Not Allowed: method: " + id + " is already defined...");
            }
            methods[ id ] = closure;
            CentralDispatcher.prototype[ id ] = closure;
        } else {
            throw new Error("addMethod requires closure for id " + id);
        }

        return dispatcher;
    };

    /**
     * Override (or add) an existing method to the dispatcher.
     *
     * @param id - the unique signature for this method
     * @param closure - the implementing function
     * @returns dispatcher to enable chaining
     */
    this.overrideMethod = function( id, closure ) {
        if (id && typeof closure === 'function') {
            methods[ id ] = closure;
            CentralDispatcher.prototype[ id ] = closure;
        } else {
            throw new Error("addMethod requires closure for id " + id);
        }

        return dispatcher;
    };

    /**
     * remove the method from the dispatcher
     *
     * @param id
     */
    this.removeMethod = function( id ) {
        delete methods[ id ];
        delete CentralDispatcher.prototype[ id ]
    };

    /**
     * return true if the method exists for the given id
     *
     * @param id - the formal signature for this method
     * @returns {boolean}
     */
    this.hasMethod = function( id ) {
        return typeof methods[ id ] === 'function';
    };

    /**
     * execute takes the function name, a request object, success and fail callbacks.  it returns
     * whatever the function returns (usually undefined) but is intended for asynchronous use. e.g.,
     * it could invoke an ajax service and handle the success and failure response events.
     *
     * see the unit tests for examples of use...
     */
    this.execute = function( id, request, success, fail ) {
        var method = methods[ id ];
        if (method) {
            return method( request, success, fail );
        } else {
            throw new Error('method not found: ' + id);
        }
    };

    /**
     * add an event listener using a unique type identifier and listener method
     *
     * @param type - the event type id, preferably a unique string
     * @param listener - the method that handles a broadcast event
     */
    this.addListener = function( type, listener ) {
        var list = listeners[ type ];
        if ( typeof list === 'undefined' ) {
            listeners[ type ] = [ listener ];
        } else {
            list.push( listener );
        }
    };

    /**
     * remove the specific type/listener combination.  this does not effect listeners with the same type.
     */
    this.removeListener = function( type, listener ) {

        var list = listeners[ type ];
        if ( list instanceof Array ) {
            var idx = list.indexOf( listener );
            if ( idx >= 0 ) {
                list.splice( idx, 1 );
            }
        }
    };

    /**
     * return true if the type and method are registered as a listener
     */
    this.hasListener = function( type, listener ) {

        var list = listeners[ type ];
        var idx = -1;
        if ( list instanceof Array ) {
            var idx = list.indexOf( listener );
        }

        return (idx >= 0);
    };

    /**
     * return true if a type has at least one listener
     */
    this.hasListenerType = function( type ) {
        return listeners[ type ] instanceof Array;
    };

    /**
     * broadcast the event to all listeners for the give event type identifier
     *
     * @param event
     */
    this.dispatchEvent = function( event ) {
        if ( event.type ) {
            var list = listeners[ event.type ];

            if ( list instanceof Array ) {
                event.currentTarget = event.currentTarget || dispatcher;
                event.timestamp = new Date().getTime();

                for ( var i = 0; i < list.length; i++ ) {
                    var handler = list[ i ];
                    if ( handler === undefined ) {
                        throw new Error( 'Handler is undefined' + event );
                    }

                    handler.call( this, event );
                }
            }
        } else {
            throw new Error( 'Attempt to dispatch an event without a defined type: ' + event );
        }
    };

    /**
     * return the list of defined event listeners
     */
    this.getListeners = function() {
        return listeners;
    };

    /**
     * return the list of method definitions
     */
    this.getMethods = function() {
        return methods;
    };

    /**
     * return a list (array) of all registered methods
     */
    this.listMethodNames = function() {
        var list = [];
        for (var key in methods) {
            list.push( key );
        }

        return list;
    };

    /**
     * invoke the function at a later time.
     *
     * @param fn the function to invoke
     */
    this.invokeLater = function(fn) {
        setTimeout(function() {
            fn.call( arguments );
        }, 10);
    }
};

CentralDispatcher.VERSION = '2013.05.16-14452';
/**
 * Simple class extension of functions and public properties.  The best way to use this extender is for simple extension
 * of value objects or function objects.  Where it breaks down is if any of the base class's methods depend on the
 * state of it's variables--even if they are public.
 *
 * @created: 3/31/13 7:11 PM
 * @author: darryl.west@roundpeg.com
 */
var ClassExtender = {};

/**
 * extend : A static(ish) method to extend the parent capabilities to the child.
 *
 * Example 1: use this inside a class definition
 *  var MySuperMapper = function() {
 *      ClassExtender.extend( new AbstractMapper(), this );
 *      ...
 *  };
 *
 * Example 2: chained inheritance
 *  var Cat = function() {
 *  };
 *  ...
 *  var furryAnimal = ClassExtender.extend( new Animal(), new FurryPet() );
 *  var cat = ClassExtender.extend( furryAnimal, new Cat() );
 *  ...
 *
 *
 * @param parent - the base or abstract class
 * @param child - the inheriting class
 * @returns the child
 */
ClassExtender.extend = function(parent, child) {
    for (var key in parent) {
        // inherit
        child[ key ] = parent[ key ];
    }

    child.parent = parent;

    return child;
};/**
 * RemoteLogger - log to a remote end point
 * created: 2011.06.28
 *
 * @version 2011.07.08-807  - original
 * @version 2012.02.27-4560 - moved levels before category
 * @version 2012.08.16-8909 - added send interface for remote implementation
 * @version 2012.09.29-9479 - refactor for LabLib tests
 * @version 2013.01.02-11621 - refactor common methods to prototype
 * @version 2013.03.31-14024 - refactor to work with node
 * @version 2013.05.16-14453 - added warn console log
 *
 * levels debug:0, info:1, warn:2, error:3
 *
 * USE: var log = RemoteLogger.createLogger( 'CategoryName' );
 *
 * CategoryName is usually the class name
 *
 * Dependencies:
 * 	console.log (unless overridden)
 * 	unique.js for session UUID
 *
 */

// for window-less server applications
if (typeof(window) !== 'undefined') {
    // IE workaround
    if (typeof(window["console"]) === "undefined") {
        console = {};
        console.log = function() {};
        console.warn = function() {};
    } else {
        if (typeof console.warn === "undefined") {
            console.warn = console.log;
        }
    }
}

var RemoteLogger = function(category, level) {
    var logger = this;

    this.getCategory = function() {
        return category;
    };

    // public to enable changing at runtime
    this.level = (level === undefined) ? 1 : level;

    // public instance to enable instance override
    this.log = function(level, obj) {
        var msg = [ RemoteLogger.id++, new Date().getTime(), level, category, obj ];

        logger.logToOutput( msg );

        if (typeof logger.send === 'function') {
            logger.send( msg );
        }
    };
};

RemoteLogger.VERSION = '2013.05.16-14453';

/**
 * override this at the application level
 *
 * @param msg
 */
RemoteLogger.prototype.send;

RemoteLogger.prototype.logToOutput = function(msg) {
    switch (msg[2]) {
        case 'WARN':
        case 'ERROR':
            console.warn( msg.join(' ') );
            break;
        default:
            console.log( msg.join(' ') );
            break;
    }

};

RemoteLogger.prototype.isDebug = function() {
    return (this.level === 0);
};

RemoteLogger.prototype.debug = function(obj) {
    if (this.level === 0) {
        this.log( 'debug', Array.prototype.slice.call( arguments ).join('') );
    }
};

RemoteLogger.prototype.info = function() {
    if (this.level <= 1) {
        this.log( 'INFO', Array.prototype.slice.call( arguments ).join('') );
    }
};

RemoteLogger.prototype.warn = function(obj) {
    if (this.level <= 2) {
        this.log( 'WARN', Array.prototype.slice.call( arguments ).join('') );
    }
};

RemoteLogger.prototype.error = function(obj) {
    if (this.level <= 3) {
        this.log( 'ERROR', Array.prototype.slice.call( arguments ).join('') );
    }
};

RemoteLogger.prototype.assert = function(bool, text) {
    if (!bool) {
        this.log( 'ASSERT', text );
    }
};

// Constants
RemoteLogger.DEBUG = 0;
RemoteLogger.INFO = 1;
RemoteLogger.WARN = 2;
RemoteLogger.ERROR = 3;

// psuedo-static vars
RemoteLogger.id = 100;
RemoteLogger.loggers = [];

/**
 * factory constructor
 */
RemoteLogger.createLogger = function(category, level) {
    if (!category) {
        category = 'Unknown-' + RemoteLogger.loggers.length;
    }

    // public to enable changing at runtime
    var level = (level === undefined) ? 1 : level;

    var log = new RemoteLogger( category, level );
    RemoteLogger.loggers.push( log );

    return log;
};

/**
 * set the level of specified array of loggers, or if null to all loggers
 */
RemoteLogger.setLevels = function(level, loggers) {
    if (typeof loggers === "undefined") loggers = RemoteLogger.loggers;

    loggers.forEach(function(logger) {
        logger.level = level;
    });
};

RemoteLogger.createSession = function(appName, appVersion) {
    var session = {
        ssid:UUID.create(),
        appName:appName,
        appVersion:appVersion,
        startDate:new Date().getTime(),
        userAgent:navigator.userAgent,
        platform:navigator.platform,
        host:location.host,
        href:location.href,
        origin:location.origin
    };

    return session;
};
/**
 * darryl.west@roundpeg.com
 */

var UniqueLib = { VERSION: '2013.11.17-9470' };

var UUID = {
    create: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g,
            function( c ) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString( 16 );
            }
        );
    }
};

var UID = {
    create: function( name ) {
        if ( name ) {
            name = name.trim();
        } else {
            name = 'UID';
        }

        var t = [
            name,
            (Math.floor( Math.random() * 16 )).toString( 22 ),
            new Date().getTime().toString( 19 ),
            (Math.floor( Math.random() * 0x1000 )).toString( 22 )
        ];

        return t.join( '' );
    }
};
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

