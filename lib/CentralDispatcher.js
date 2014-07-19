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
