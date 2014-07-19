/**
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
