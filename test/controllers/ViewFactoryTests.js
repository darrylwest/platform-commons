/**
 * ComponentFactoryTests - description
 *
 * @author steve@roundpeg.com
 * @created 4/3/14 10:24 AM
 *
 *
 */

describe( 'ViewFactory', function() {
    'use strict';

    var config = Config.test(),
        log = new RemoteLogger( 'ComponentFactoryTests', RemoteLogger.ERROR ),
        options = dash.clone( config );

    options.log = log;

    options.createLogger = function( name ) {
        return new RemoteLogger( name, RemoteLogger.ERROR );
    };

    options.delegateFactory = new DelegateFactory( options );

    describe( '#instance', function() {
        var factory = new ViewFactory( options ),
            methods = [
                'createMainView'
            ];

        it( 'should create an instance of ViewFactory', function() {
            should.exist( factory );
            factory.should.be.instanceof( ViewFactory );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( factory ).length.should.equal( methods.length );
        } );

        it( 'should execute all known create methods', function() {

            methods.forEach( function( method ) {
                factory.hasOwnProperty( method ).should.equal( true );
                factory[ method ].should.be.a( 'function' );

                if ( method.indexOf( 'create' ) === 0 ) {
                    var obj = factory[ method ]();

                    should.exist( obj );
                }
            } );
        } );
    } );

    describe( '#components', function() {

        var factory = new ViewFactory( options );

        it( 'should create main view', function() {
            var view = factory.createMainView();
            should.exist( view );
            view.should.be.instanceof( MainView );
        } );

    } );

} );