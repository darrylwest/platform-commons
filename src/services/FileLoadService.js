/**
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
