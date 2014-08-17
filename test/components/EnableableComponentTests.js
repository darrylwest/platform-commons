/**
 * EnableableComponentTests - description
 *
 * @author steve@roundpeg.com
 * @created 3/28/14 7:38 AM
 *
 *
 */


describe( 'EnableableComponent', function() {
    'use strict';

    var log = new RemoteLogger( 'EnableableComponent', RemoteLogger.ERROR ),
        mockDelegateFactory = new MockDelegateFactory(),
        createOptions;

    createOptions = function() {
        var opts = Config.test();

        opts.log = log;
        opts.createLogger = function( name ) {
            return new RemoteLogger( name, RemoteLogger.ERROR );
        };

        opts.componentBuilderDelegate = mockDelegateFactory.createComponentBuilderDelegate();
        opts.element = document.createElement( 'div' );

        return opts;
    };

    describe( '#instance', function() {
        var component = new EnableableComponent( createOptions() ),
            methods = [
                'enable',
                'disable',
                'isDisabled',
                'isEnabled'
            ];

        it( 'should create an instance of EnableableComponent', function() {
            should.exist( component );
            component.should.be.instanceof( EnableableComponent );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( component ).length.should.equal( methods.length );
        } );

        it( 'should execute all known methods', function() {
            methods.forEach( function( method ) {
                component[ method ]();
            } );
        } );


    } );

    describe( '#enabled', function() {
        var component = new EnableableComponent( createOptions() );

        it( 'should be enabled when created', function() {
            component.isDisabled().should.equal( false );
        } );

        it( 'should be disabled when disable called', function() {
            component.enable();
            component.disable();
            component.isDisabled().should.equal( true );
        } );

        it( 'should be enabled when enable called', function() {
            component.disable();
            component.enable();
            component.isDisabled().should.equal( false );
        } );
    } );

} );