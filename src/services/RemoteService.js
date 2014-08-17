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

