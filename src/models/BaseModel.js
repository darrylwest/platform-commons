/**
 * BaseModel is used as the base for models that are persisted to the database.  Use ClassExtender to extend.
 *
 * @created: 4/1/13 10:52 AM
 * @author: darryl.west@roundpeg.com
 */
var BaseModel = function(params) {
    "use strict";
    if (!params) params = {};

    // work-around for grails/mongo ids
    if ( params._id ) {
        params.id = params._id;
    }

    this.id = params.id;
    this.dateCreated = params.dateCreated;
    this.lastUpdated = params.lastUpdated;
    this.version = params.version === undefined ? 0 : params.version;
};
