/**
 * HidableComponentTests
 *
 * @author steve@roundpeg.com
 * @created 4/7/14 4:08 PM
 *
 *
 */

describe( 'HidableComponent', function() {
    'use strict';

    var log = new RemoteLogger( 'HidableComponent', RemoteLogger.ERROR ),
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
        var component = new HidableComponent( createOptions() ),
            methods = [
                'hide',
                'show',
                'isHidden'
            ];

        it( 'should create an instance of HidableComponent', function() {
            should.exist( component );
            component.should.be.instanceof( HidableComponent );
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

    describe( '#showHide', function() {
        var component = new HidableComponent( createOptions() );

        it( 'should not be hidden when created', function() {
            component.isHidden().should.equal( false );
        } );

        it( 'should be hidden when hide called', function() {
            component.hide();
            component.isHidden().should.equal( true );
        } );

        it( 'should be enabled when enable called', function() {
            component.show();
            component.isHidden().should.equal( false );
        } );
    } );

} );