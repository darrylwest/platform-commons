/**
 * ApplicationFactoryTests -
 *
 * @see http://chaijs.com/guide/styles/#should for syntax reference
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2/12/14
 */

describe( 'ApplicationFactory', function() {
    'use strict';

    var config = Config.test(),
        options = dash.clone( config );

    // options.agent = new MockAjax().ajax;
    options.createLogger = function( name ) {
        return new RemoteLogger( name, RemoteLogger.ERROR );
    };

    describe( '#instance', function() {
        var factory = new ApplicationFactory( options ),
            methods = [
                'createCentralDispatcher',
                'createViewFactory',
                'createDelegateFactory',
                'createServiceFactory',
                'createViewController',
                'createAgent',
                'initialize',
                'initListeners',
                'startApplication',
                'configurationReadyHandler',
                'fireApplicationReadyEvent'
            ];

        it( 'should create an instance of ApplicationFactory', function() {
            should.exist( factory );
            factory.should.be.instanceof( ApplicationFactory );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( factory ).length.should.equal( methods.length );
        } );

        it( 'should execute all known create methods', function() {
            var list = [];

            methods.forEach( function( method ) {
                factory.hasOwnProperty( method ).should.equal( true );
                factory[ method ].should.be.a( 'function' );

                if ( method.indexOf( 'create' ) === 0 ) {
                    var obj = factory[ method ]();

                    should.exist( obj );
                } else if ( method === 'fireApplicationReadyEvent' ) {
                    // factory.fireApplicationReadyEvent();
                } else if ( method === 'initialize' || method === 'startApplication' ) {
                    console.log( 'skip' );
                }
            } );
        } );
    } );

    describe( '#create', function() {
        var factory = new ApplicationFactory( options );

        it( 'should create central dispatcher', function() {
            var dispatcher = factory.createCentralDispatcher();
            dispatcher.should.be.instanceof( CentralDispatcher );
        } );

        it( 'should create view factory', function() {
            var viewFactory = factory.createViewFactory();
            viewFactory.should.be.instanceof( ViewFactory );
        } );

        it( 'should create delegate factory', function() {
            var delegateFactory = factory.createDelegateFactory();
            delegateFactory.should.be.instanceof( DelegateFactory );
        } );

        it( 'should create service factory', function() {
            var delegateFactory = factory.createServiceFactory();
            delegateFactory.should.be.instanceof( ServiceFactory );
        } );

        it( 'should create view controller', function() {
            var controller = factory.createViewController();
            controller.should.be.instanceof( ViewController );
        } );

    } );

} );
