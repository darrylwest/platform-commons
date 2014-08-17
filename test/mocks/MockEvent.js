/**
 * Created by JetBrains WebStorm.
 * User: steve@roundpeg.com
 * Date: 4/2/13
 * File: MockEvent
 *
 */

var MockEvent = function( type, data ) {
    'use strict';

    this.type = type;
    this.data = data;
};

MockEvent.QUERY_SUCCESS = 'QuerySuccessEvent_MockEvent';
MockEvent.QUERY_FAIL = 'QueryFailEvent_MockEvent';

MockEvent.FIND_SUCCESS = 'FindSuccessEvent_MockEvent';
MockEvent.FIND_FAIL = 'FindFailEvent_MockEvent';

MockEvent.SAVE_SUCCESS = 'SaveSuccessEvent_MockEvent';
MockEvent.SAVE_FAIL = 'SaveFailEvent_MockEvent';

MockEvent.SERVICE_FAIL = 'ServiceFailEvent_MockEvent';