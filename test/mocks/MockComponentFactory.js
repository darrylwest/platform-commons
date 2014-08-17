/**
 * MockComponentFactory
 *
 * @author steve@roundpeg.com
 * @created 6/13/14 1:14 PM
 *
 *
 */

var MockComponentFactory = function( options ) {
    'use strict';

    var mock = this;

    if ( !options ) {
        options = Config.test();
    }

    if ( !options.log ) {
        options.log = new RemoteLogger( 'MockComponentFactory', RemoteLogger.ERROR );
    }

    if ( !options.delegateFactory ) {
        options.delegateFactory = new MockDelegateFactory();
    }

    options.createLogger = function( name ) {
        return new RemoteLogger( name, RemoteLogger.ERROR );
    };

    ClassExtender.extend( new ViewFactory( options ), this );
};