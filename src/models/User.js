/* global ClassExtender, BaseModel */
/**
 * User - extends basic model with token, display name, email, dealer number, dealer name, region and status; also
 * adds validation methods
 */

var User = function( params ) {
    "use strict";
    if (!params) params = {};

    ClassExtender.extend( new BaseModel( params ), this );

    this.ip = params.ip;
    this.token = params.token;
    this.username = params.username;
    this.attributes = params.attributes;
    this.status = params.status;
};

User.ACTIVE = 'active';
User.INACTIVE = 'inactive';
User.BANNED = 'banned';