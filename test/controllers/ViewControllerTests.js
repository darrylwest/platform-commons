/**
 * ViewControllerTests - test operation of all methods
 *
 * @see http://chaijs.com/guide/styles/#should for syntax reference
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2/15/14
 */

describe( 'ViewController', function() {
    'use strict';

    var log = new RemoteLogger( 'ViewControllerTests', RemoteLogger.ERROR ),
        dataset = new TestDataset(),
        createVewController,
        applicationFactory;

    createVewController = function() {

        var opts = Config.test(),
            viewController;

        opts.createLogger = function( name, level ) {
            if ( !level ) {
                level = RemoteLogger.ERROR + 1;
            }
            return new RemoteLogger( name, level );
        };

        applicationFactory = new ApplicationFactory( opts );

        viewController = applicationFactory.createViewController();

        return viewController;
    };

    describe( '#instance', function() {
        var controller = createVewController(),
            methods = [
                'initListeners',
                'configurationReadyHandler',
                'applicationReadyHandler',
                'applicationStartHandler',
                'fireApplicationStartEvent',
                'sessionIdChangeHandler',
                'sessionLogMessageHandler'
            ];

        it( 'should create an instance of ViewController', function() {
            should.exist( controller );

            controller.should.be.instanceof( ViewController );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( controller ).length.should.equal( methods.length );
        } );

    } );

    describe( '#eventHandlers', function() {
        var controller = createVewController();

        it( 'should execute configurationReadyHandler', function() {
            var configuration = dataset.createMockConfiguration(),
                event = new MockEvent( 'conf', configuration );

            controller.configurationReadyHandler( event );
            should.exist( document );
            document.title.should.equal( configuration.documentTitle );
        } );
    } );

    describe( 'initListeners', function() {
        var controller = createVewController(),
            dispatcher = applicationFactory.createCentralDispatcher();

        it( 'should verify that all known listeners are attached to dispatcher', function() {
            // verify that the dispatcher is clear
            dash.size( dispatcher.getListeners() ).should.equal( 0 );
            dash.size( dispatcher.getMethods() ).should.equal( 0 );

            controller.initListeners();

            // verify the correct number of listeners
            dash.size( dispatcher.getListeners() ).should.equal( 3 );
            dash.size( dispatcher.getMethods() ).should.equal( 0 );

            // verify that the listeners are bound to the correct methods
            dispatcher.hasListener( ApplicationStateEvent.CONFIGURATION_READY, controller.configurationReadyHandler ).should.equal( true );
            dispatcher.hasListener( ApplicationStateEvent.APPLICATION_READY, controller.applicationReadyHandler ).should.equal( true );
            dispatcher.hasListener( ApplicationStateEvent.APPLICATION_START, controller.applicationStartHandler ).should.equal( true );

        } );
    } );
} );