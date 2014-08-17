/* globals ClassExtender, AbstractModelParser */
/**
 * Created by JetBrains WebStorm.
 * User: steve@roundpeg.com
 * Date: 4/2/13
 * File: MockParser
 *
 */

var MockParser = function() {
    "use strict";
    var log = new RemoteLogger( 'MockParser', RemoteLogger.WARN ),
        parser = this;

    ClassExtender.extend( new AbstractModelParser(), this );

    this.parseModel = function( obj ) {
        log.info( 'parse publisher find response from JSON' );

        var response = parser.parseResponse( obj );

        if ( response.status === 'ok' ) {
            response.data = {thing: 'Hello World'};
        }

        return response;
    };

    this.parseList = function( obj ) {

        var response = parser.parseResponse( obj );

        if ( response.status === 'ok' ) {
            response.data = [
                {thing: 'Hello World'},
                {thing: 'Hello Moon'},
                {thing: 'Hello Stars'}
            ];
        }

        return response;

    };

};
