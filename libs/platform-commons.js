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
/**
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
 * lscache library
 * Copyright (c) 2011, Pamela Fox
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint undef:true, browser:true, node:true */
/* global define */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module !== "undefined" && module.exports) {
        // CommonJS/Node module
        module.exports = factory();
    } else {
        // Browser globals
        root.lscache = factory();
    }
}(this, function () {

  // Prefix for all lscache keys
  var CACHE_PREFIX = 'lscache-';

  // Suffix for the key name on the expiration items in localStorage
  var CACHE_SUFFIX = '-cacheexpiration';

  // expiration date radix (set to Base-36 for most space savings)
  var EXPIRY_RADIX = 10;

  // time resolution in minutes
  var EXPIRY_UNITS = 60 * 1000;

  // ECMAScript max Date (epoch + 1e8 days)
  var MAX_DATE = Math.floor(8.64e15/EXPIRY_UNITS);

  var cachedStorage;
  var cachedJSON;
  var cacheBucket = '';
  var warnings = false;

  // Determines if localStorage is supported in the browser;
  // result is cached for better performance instead of being run each time.
  // Feature detection is based on how Modernizr does it;
  // it's not straightforward due to FF4 issues.
  // It's not run at parse-time as it takes 200ms in Android.
  function supportsStorage() {
    var key = '__lscachetest__';
    var value = key;

    if (cachedStorage !== undefined) {
      return cachedStorage;
    }

    try {
      setItem(key, value);
      removeItem(key);
      cachedStorage = true;
    } catch (exc) {
      cachedStorage = false;
    }
    return cachedStorage;
  }

  // Determines if native JSON (de-)serialization is supported in the browser.
  function supportsJSON() {
    /*jshint eqnull:true */
    if (cachedJSON === undefined) {
      cachedJSON = (window.JSON != null);
    }
    return cachedJSON;
  }

  /**
   * Returns the full string for the localStorage expiration item.
   * @param {String} key
   * @return {string}
   */
  function expirationKey(key) {
    return key + CACHE_SUFFIX;
  }

  /**
   * Returns the number of minutes since the epoch.
   * @return {number}
   */
  function currentTime() {
    return Math.floor((new Date().getTime())/EXPIRY_UNITS);
  }

  /**
   * Wrapper functions for localStorage methods
   */

  function getItem(key) {
    return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
  }

  function setItem(key, value) {
    // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
    localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
  }

  function removeItem(key) {
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
  }

  function warn(message, err) {
    if (!warnings) return;
    if (!('console' in window) || typeof window.console.warn !== 'function') return;
    window.console.warn("lscache - " + message);
    if (err) window.console.warn("lscache - The error was: " + err.message);
  }

  var lscache = {
    /**
     * Stores the value in localStorage. Expires after specified number of minutes.
     * @param {string} key
     * @param {Object|string} value
     * @param {number} time
     */
    set: function(key, value, time) {
      if (!supportsStorage()) return;

      // If we don't get a string value, try to stringify
      // In future, localStorage may properly support storing non-strings
      // and this can be removed.
      if (typeof value !== 'string') {
        if (!supportsJSON()) return;
        try {
          value = JSON.stringify(value);
        } catch (e) {
          // Sometimes we can't stringify due to circular refs
          // in complex objects, so we won't bother storing then.
          return;
        }
      }

      try {
        setItem(key, value);
      } catch (e) {
        if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.name === 'QuotaExceededError') {
          // If we exceeded the quota, then we will sort
          // by the expire time, and then remove the N oldest
          var storedKeys = [];
          var storedKey;
          for (var i = 0; i < localStorage.length; i++) {
            storedKey = localStorage.key(i);

            if (storedKey.indexOf(CACHE_PREFIX + cacheBucket) === 0 && storedKey.indexOf(CACHE_SUFFIX) < 0) {
              var mainKey = storedKey.substr((CACHE_PREFIX + cacheBucket).length);
              var exprKey = expirationKey(mainKey);
              var expiration = getItem(exprKey);
              if (expiration) {
                expiration = parseInt(expiration, EXPIRY_RADIX);
              } else {
                // TODO: Store date added for non-expiring items for smarter removal
                expiration = MAX_DATE;
              }
              storedKeys.push({
                key: mainKey,
                size: (getItem(mainKey)||'').length,
                expiration: expiration
              });
            }
          }
          // Sorts the keys with oldest expiration time last
          storedKeys.sort(function(a, b) { return (b.expiration-a.expiration); });

          var targetSize = (value||'').length;
          while (storedKeys.length && targetSize > 0) {
            storedKey = storedKeys.pop();
            warn("Cache is full, removing item with key '" + key + "'");
            removeItem(storedKey.key);
            removeItem(expirationKey(storedKey.key));
            targetSize -= storedKey.size;
          }
          try {
            setItem(key, value);
          } catch (e) {
            // value may be larger than total quota
            warn("Could not add item with key '" + key + "', perhaps it's too big?", e);
            return;
          }
        } else {
          // If it was some other error, just give up.
          warn("Could not add item with key '" + key + "'", e);
          return;
        }
      }

      // If a time is specified, store expiration info in localStorage
      if (time) {
        setItem(expirationKey(key), (currentTime() + time).toString(EXPIRY_RADIX));
      } else {
        // In case they previously set a time, remove that info from localStorage.
        removeItem(expirationKey(key));
      }
    },

    /**
     * Retrieves specified value from localStorage, if not expired.
     * @param {string} key
     * @return {string|Object}
     */
    get: function(key) {
      if (!supportsStorage()) return null;

      // Return the de-serialized item if not expired
      var exprKey = expirationKey(key);
      var expr = getItem(exprKey);

      if (expr) {
        var expirationTime = parseInt(expr, EXPIRY_RADIX);

        // Check if we should actually kick item out of storage
        if (currentTime() >= expirationTime) {
          removeItem(key);
          removeItem(exprKey);
          return null;
        }
      }

      // Tries to de-serialize stored value if its an object, and returns the normal value otherwise.
      var value = getItem(key);
      if (!value || !supportsJSON()) {
        return value;
      }

      try {
        // We can't tell if its JSON or a string, so we try to parse
        return JSON.parse(value);
      } catch (e) {
        // If we can't parse, it's probably because it isn't an object
        return value;
      }
    },

    /**
     * Removes a value from localStorage.
     * Equivalent to 'delete' in memcache, but that's a keyword in JS.
     * @param {string} key
     */
    remove: function(key) {
      if (!supportsStorage()) return null;
      removeItem(key);
      removeItem(expirationKey(key));
    },

    /**
     * Returns whether local storage is supported.
     * Currently exposed for testing purposes.
     * @return {boolean}
     */
    supported: function() {
      return supportsStorage();
    },

    /**
     * Flushes all lscache items and expiry markers without affecting rest of localStorage
     */
    flush: function() {
      if (!supportsStorage()) return;

      // Loop in reverse as removing items will change indices of tail
      for (var i = localStorage.length-1; i >= 0 ; --i) {
        var key = localStorage.key(i);
        if (key.indexOf(CACHE_PREFIX + cacheBucket) === 0) {
          localStorage.removeItem(key);
        }
      }
    },

    /**
     * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
     * @param {string} bucket
     */
    setBucket: function(bucket) {
      cacheBucket = bucket;
    },

    /**
     * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
     */
    resetBucket: function() {
      cacheBucket = '';
    },

    /**
     * Sets whether to display warnings when an item is removed from the cache or not.
     */
    enableWarnings: function(enabled) {
      warnings = enabled;
    }
  };

  // Return the module
  return lscache;
}));

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
