/**
 * DelegateFactoryTests - description
 *
 * @author steve@roundpeg.com
 * @created 4/3/14 8:24 AM
 */

describe( 'DelegateFactory', function() {
    'use strict';

    var config = Config.test(),
        log = new RemoteLogger( 'DelegateFactoryTests', RemoteLogger.ERROR ),
        options = dash.clone( config );

    options.log = log;

    options.createLogger = function( name ) {
        return new RemoteLogger( name, RemoteLogger.ERROR );
    };

    describe( '#instance', function() {
        var factory = new DelegateFactory( options ),
            methods = [
                'createComponentBuilderDelegate',
                'createComponentGroupDelegate',
                'createStorageDelegate'
            ];

        it( 'should create an instance of DelegateFactory', function() {
            should.exist( factory );
            factory.should.be.instanceof( DelegateFactory );
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

    describe( '#delegates', function() {
        var factory = new DelegateFactory( options );

        it( 'should create Component Builder delegate', function() {
            var delegate = factory.createComponentBuilderDelegate();
            delegate.should.be.instanceof( ComponentBuilderDelegate );
        } );

        it( 'should create Component Group  delegate', function() {
            var delegate = factory.createComponentGroupDelegate();
            delegate.should.be.instanceof( ComponentGroupDelegate );
        } );

        it( 'should create storage delegate', function() {
            var delegate = factory.createStorageDelegate();
            delegate.should.be.instanceof( StorageDelegate );
        } );


    } );

} );