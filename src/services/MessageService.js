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
};