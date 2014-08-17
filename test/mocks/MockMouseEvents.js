/**
 * MockMouseEvents - mock mouse event generator that enables setting of any of the standard mouse
 * properties through public properties.
 *
 * USE:
 *  var opts = { type:'click', x:23, y:44, target:myelement };
 *  var mock = new MockMouseEvent( opts );
 *  var event = mock.create();
 *
 *  // override the type and create a mouse down event
 *  event = event.create('mousemove');
 *
 *  // set new x/y coordinates and create a new event
 *  event = mock.setXY( 55, 234 ).create();
 *
 * @author: darryl.west@roundpeg.com
 * @created: 3/12/14 3:09 PM
 */
var MockMouseEvents = function(options) {
    'use strict';

    var event = this;

    if (!options) options = { type:'click' };

    this.type = options.type || 'click';
    this.x = options.x;
    this.y = options.y;
    this.target = options.target;
    this.canBubble = false;
    this.cancelable = true;
    this.view = window;
    this.detail = 1;
    this.screenX = 0;
    this.screenY = 0;
    this.clientX = options.x;
    this.clientY = options.y;
    this.ctrlKey = false;
    this.altKey = false;
    this.metaKey = false;
    this.button = 1;
    this.relatedTarget = options.relatedTarget;

    this.setXY = function(x, y) {
        event.x = x;
        event.y = y;
        event.clientX = x;
        event.clientY = y;

        return event;
    };

    this.create = function(type) {
        if (!type) {
            type = event.type;
        }

        // this is deprecated and may have to be replaced with CustomEvent
        var m = document.createEvent('MouseEvents');

        m.initMouseEvent(
            type, event.canBubble, event.cancelable, event.view, event.detail,
            event.screenX, event.screenY, event.clientX, event.clientY,
            event.ctrlKey, event.altKey, event.metaKey,
            event.button, event.relatedTarget
        );

        return m;
    };

    return this;
};