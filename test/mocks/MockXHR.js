/**
 * Mock a standard xhr response object to enable testing of service result handlers
 */

var MockXHR = function(parameters) {
    'use strict';

    var mock = this,
        params = parameters || {},
        headers = {};

    this.status = params.status || 200;
    this.readyState = params.readyState || 4;
    this.statusText = params.statusText || "success";

    this.responseText = params.responseText || JSON.stringify( mock.createResponseObject() );

    this.setRequestHeader = function(name, value) {
        headers[ name ] = value;
    };

    this.getHeaders = function() {
        return headers;
    };
};

MockXHR.prototype.createResponseObject = function() {
    'use strict';

    return { status:'ok', ts:new Date(), version:'1.0' };
};

MockXHR.prototype.createFailResponseObject = function() {
    'use strict';

    return { status:'failed', ts:new Date(), version:'1.0', reason:'we failed' };
};

MockXHR.createFailedResponse = function(parameters) {
    'use strict';

    var params = parameters || {};

    params.status = params.status || 404;
    params.statusText = "failed";
    params.reason = params.reason || 'no specific test reason';


    var mock = new MockXHR( params );
    var response = mock.createResponseObject();
    response.status = 'failed';
    response.reason = params.reason;

    mock.responseText = JSON.stringify( response );

    return mock;
};
