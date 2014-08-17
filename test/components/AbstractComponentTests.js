/**
 * AbstractComponentTests - description
 *
 * @author steve@roundpeg.com
 * @created 3/25/14 3:55 PM
 *
 *
 */

describe( 'AbstractComponent', function() {
    'use strict';

    var log = new RemoteLogger( 'AbstractComponent', RemoteLogger.ERROR ),
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
        var component = new AbstractComponent( createOptions() ),
            methods = [
                'getId',
                'setData',
                'getData',
                'addCssClass',
                'removeCssClass',
                'toggleCssClass',
                'hasCssClass',
                'setIcon',
                'removeIcon',
                'getElement'
            ];

        it( 'should create an instance of AbstractComponent', function() {
            should.exist( component );
            component.should.be.instanceof( AbstractComponent );
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

    describe( '#created', function() {

        it( 'should create an HTML element', function() {
            var component = new AbstractComponent( createOptions() ),
                element = component.getElement(),
                container = document.createElement( 'div' );

            container.hasChildNodes().should.equal( false );

            element.should.be.instanceof( HTMLElement );

            container.appendChild( element );

            container.hasChildNodes().should.equal( true );

        } );

    } );

    describe( '#css', function() {

        var createCssOptions,
            component;

        createCssOptions = function( className ) {
            var opts = createOptions();

            if ( !className ) {
                className = 'myComp';
            }

            opts.cssClass = className;

            return opts;
        };

        it( 'should have a cssClass when added', function() {
            component = new AbstractComponent( createCssOptions() );
            component.hasCssClass( 'fred' ).should.equal( false );
            component.addCssClass( 'fred' );
            component.hasCssClass( 'fred' ).should.equal( true );
        } );

        it( 'should not have a cssClass when removed', function() {
            component = new AbstractComponent( createCssOptions() );
            component.hasCssClass( 'fred' ).should.equal( false );
            component.addCssClass( 'fred' );
            component.hasCssClass( 'fred' ).should.equal( true );
            component.removeCssClass( 'fred' );
            component.hasCssClass( 'fred' ).should.equal( false );
        } );

        it( 'should toggle a cssClass', function() {
            component = new AbstractComponent( createCssOptions() );
            component.hasCssClass( 'barney' ).should.equal( false );
            component.toggleCssClass( 'barney' );
            component.hasCssClass( 'barney' ).should.equal( true );
            component.toggleCssClass( 'barney' );
            component.hasCssClass( 'barney' ).should.equal( false );

        } );

    } );

    describe( '#icon', function() {

        it( 'should have an icon', function() {
            var component = new AbstractComponent( createOptions() ),
                element = component.getElement();

            component.setIcon( 'myIconClass' );

            element.firstChild.classList.toString().should.equal( 'myIconClass' );

            element.childNodes.length.should.equal( 1 );

        } );

        it( 'should only have 0 child when created', function() {

            var component = new AbstractComponent( createOptions() );

            component.getElement().childNodes.length.should.equal( 0 );

        } );

        it( 'should have 0 children when the icon is removed', function() {

            var component = new AbstractComponent( createOptions() ),
                element = component.getElement();

            component.setIcon( 'myIconClass' );
            element.childNodes.length.should.equal( 1 );

            component.removeIcon();

            element.childNodes.length.should.equal( 0 );
        } );

        it( 'should only have 1 child when icon is set multiple times ', function() {
            var component = new AbstractComponent( createOptions() ),
                element = component.getElement();

            element.childNodes.length.should.equal( 0 );

            component.setIcon( 'testIcon' );
            element.childNodes.length.should.equal( 1 );

            element.firstChild.classList.toString().should.equal( 'testIcon' );

            component.setIcon( 'testIcon2' );

            element.childNodes.length.should.equal( 1 );

            element.firstChild.classList.toString().should.equal( 'testIcon2' );

        } );
    } );
} );
