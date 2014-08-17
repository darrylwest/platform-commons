/**
 * TestDataset
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2/13/14
 */
var TestDataset = function() {
    'use strict';

    var dataset = this,
        log = new RemoteLogger( 'TestDataset', RemoteLogger.ERROR ),
        createOptions;

    createOptions = function() {
        var opts = Config.test();

        opts.log = log;
        opts.createLogger = function( name ) {
            return new RemoteLogger( name, RemoteLogger.ERROR );
        };

        return opts;
    };

    this.createBaseModelParams = function() {
        var params = {
            id: dataset.createModelId(),
            dateCreated: new Date().toJSON(),
            lastUpdated: new Date().toJSON(),
            version: dash.random( 0, 9 )
        };

        return params;
    };

    this.populateBaseModel = function( model ) {
        model.id = dataset.createModelId();
        model.dateCreated = new Date();
        model.lastUpdate = new Date();
        model.version = 0;
    };

    this.createModelId = function() {
        return UUID.create().replace( /-/g, '' );
    };

    this.createResponseWrapper = function() {
        var obj = {
            "status": "ok",
            "ts": new Date().toJSON(),
            "version": "1.0"
        };

        return obj;
    };

    this.createFailedResponse = function( reason ) {
        if ( !reason ) {
            reason = 'it failed';
        }

        var obj = dataset.createResponseWrapper();
        obj.status = 'failed';
        obj.reason = reason;

        return obj;
    };

    this.createMockConfiguration = function(){
        log.info( 'createMockConfiguration: ' );

        var configuration = {
            "documentTitle": "My Application Title",
            "messageStore": {},
            "topNavButtons": [
                { "key": "home", "label": "Home", "tooltip": "Show  Home Container", "cssClass": "navbar-link" },
                { "key": "help", "label": "Help", "tooltip": "Show Help Container", "cssClass": "navbar-link" },
                { "key": "logout", "label": "Logout", "tooltip": "Logout", "cssClass": "navbar-link" }
            ]
        };

        return configuration;
    };

    this.createButtons = function() {
        var configuration = dataset.createMockConfiguration(),
            buttonConfig = configuration.topNavButtons,
            mockDelegateFactory = new MockDelegateFactory(),
            group = [],
            componentBuilder = mockDelegateFactory.createComponentBuilderDelegate();

        buttonConfig.forEach( function( config ) {
            var buttonOpts = {
                    id: config.key,
                    cssClass: config.cssClass,
                    label: config.label,
                    tooltip: config.tooltip,
                    data: config
                },
                button = componentBuilder.createButtonComponent( buttonOpts );

            group.push( button );

        } );

        return group;
    };


};
