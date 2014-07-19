/**
 *
 * @created: 12/26/12 2:54 PM
 * @author: darryl.west@roundpeg.com
 */
var AuthenticationEvent = function( type, data ) {
    'use strict';

    this.type = type;
    this.data = data;
};

AuthenticationEvent.SUCCESS = 'AuthenticationSuccess_AuthenticationEvent';
AuthenticationEvent.FAILED = 'AuthenticationFailed_AuthenticationEvent';
AuthenticationEvent.SERVICE_FAIL = 'ServiceFailed_AuthenticationEvent';

AuthenticationEvent.createSuccessEvent = function( user ) {
    'use strict';
    return new AuthenticationEvent( AuthenticationEvent.SUCCESS, user );
};

AuthenticationEvent.createFailedEvent = function( reason ) {
    'use strict';
    return new AuthenticationEvent( AuthenticationEvent.FAILED, reason );
};

AuthenticationEvent.createServiceFailed = function( reason ) {
    'use strict';
    return new AuthenticationEvent( AuthenticationEvent.SERVICE_FAIL, reason );
};
