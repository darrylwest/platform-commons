/**
 * @class MockMesageClient
 * @classdesc subscribe to a channel; publish a message; cancel a subscription;
 *
 * @copyright Copyright &copy; 2014 Waterous
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/1/14 11:53 AM
 */
var MockMessageClient = function() {
    'use strict';

    var client = this,
        messageCallback;

    this.channel = null;

    this.subscribe = function(channel, callback) {
        client.channel = channel;
        console.log('subscribed to ', channel);
        messageCallback = callback;
    };

    this.then = function(callback) {
        if (callback) {
            dash.defer( callback, 'subscription accepted' );
        }
    };

    this.cancel = function() {
        client.channel = null;
    };

    this.publish = function(channel, message) {
        if (channel === client.channel && messageCallback) {
            dash.defer( messageCallback, message );
        }
    };
};
