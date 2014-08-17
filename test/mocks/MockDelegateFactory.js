/**
 * MockDelegateFactory -
 *
 * @author steve@roundpeg.com
 * @created 6/4/14 3:06 PM
 *
 *
 */

var MockDelegateFactory = function( options ) {
    'use strict';

    var mock = this;

    if ( !options ) {
        options = Config.test();
    }

    if ( !options.log ) {
        options.log = new RemoteLogger( 'MockDelegateFactory', RemoteLogger.ERROR );
    }

    options.createLogger = function( name ) {
        return new RemoteLogger( name, RemoteLogger.ERROR );
    };

    ClassExtender.extend( new DelegateFactory( options ), this );
};