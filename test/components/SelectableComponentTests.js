/**
 * SelectableComponentTests - description
 *
 * @author steve@roundpeg.com
 * @created 3/27/14 4:28 PM
 *
 *
 */

describe( 'SelectableComponent', function() {
    'use strict';

    var log = new RemoteLogger( 'SelectableComponent', RemoteLogger.ERROR ),
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
        var component = new SelectableComponent( createOptions() ),
            methods = [
                'setSelected',
                'clearSelected',
                'isSelected',
                'toggleSelected'
            ];

        it( 'should create an instance of ButtonComponent', function() {
            should.exist( component );
            component.should.be.instanceof( SelectableComponent );
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


    describe( '#selected', function() {

        var component = new SelectableComponent( createOptions() );

        it( 'should not be selected at creation', function() {
            component.isSelected().should.equal( false );
        } );

        it( 'should be selected when setSelected', function() {
            component.setSelected();
            component.isSelected().should.equal( true );
        } );

        it( 'should not be selected when clearSelected', function() {
            component.setSelected();
            component.clearSelected();
            component.isSelected().should.equal( false );
        } );

        it( 'should be selected when toggle selected from not selected', function() {
            component.clearSelected();
            component.toggleSelected();
            component.isSelected().should.equal( true );
        } );

        it( 'should not be selected when toggle selected from selected', function() {
            component.setSelected();
            component.toggleSelected();
            component.isSelected().should.equal( false );
        } );

    } );

} );


