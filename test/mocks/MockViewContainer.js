/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2/18/14 3:56 PM
 */
var MockViewContainer = function(options) {
    'use strict';

    var mock = this;

    if (!options) options = {};
    if (!options.container) options.container = document.createElement('div');
    if (!options.viewName) options.viewName = 'mockView';

    ClassExtender.extend( new AbstractViewContainer( options ), this );
};