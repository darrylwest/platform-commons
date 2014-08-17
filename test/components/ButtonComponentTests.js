/**
 *  ButtonComponentTests
 *
 * @author steve@roundpeg.com
 * @created 3/11/14
 *
 */

describe( 'ButtonComponent', function() {
    'use strict';

    var mockClickEvent = new MockMouseEvents().create( 'click' ),
        log = new RemoteLogger( 'ButtonComponent', RemoteLogger.ERROR ),
        mockDelegateFactory = new MockDelegateFactory(),
        createOptions;

    createOptions = function() {
        var opts = Config.test();

        opts.log = log;
        opts.createLogger = function( name ) {
            return new RemoteLogger( name, RemoteLogger.ERROR );
        };

        opts.componentBuilderDelegate = mockDelegateFactory.createComponentBuilderDelegate();

        return opts;
    };

    describe( '#instance', function() {
        var button = new ButtonComponent( createOptions() ),
            methods = [
                'setLabel',
                'getLabel',
                'buttonClickHandler',
                //inheritedAbstractMethods
                'getId',
                'setData',
                'getData',
                'addCssClass',
                'removeCssClass',
                'toggleCssClass',
                'hasCssClass',
                'setIcon',
                'removeIcon',
                'getElement',
                //inheritedSelectableMethods
                'setSelected',
                'clearSelected',
                'isSelected',
                'toggleSelected',
                //inheritedEnableableMethods
                'enable',
                'disable',
                'isDisabled',
                'isEnabled'
            ];


        it( 'should create an instance of ButtonComponent', function() {
            should.exist( button );
            button.should.be.instanceof( ButtonComponent );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( button ).length.should.equal( methods.length );
        } );

        it( 'should execute all known methods', function() {
            methods.forEach( function( method ) {

                if ( method === 'buttonClickHandler' ) {
                    button.buttonClickHandler( mockClickEvent );
                } else if ( method === 'setLabel' ) {
                    button.setLabel( 'hello' );
                } else {
                    button[ method ]();
                }
            } );
        } );


    } );

    describe( '#created', function() {

        it( 'should create an HTML element', function() {
            var button = new ButtonComponent( createOptions() ),
                element = button.getElement(),
                container = document.createElement( 'div' );

            container.hasChildNodes().should.equal( false );

            element.should.be.instanceof( HTMLElement );

            container.appendChild( element );

            container.hasChildNodes().should.equal( true );

        } );

    } );

    describe( '#label', function() {
        var button;

        button = new ButtonComponent( createOptions() );

        it( 'should have a label of &nbsp; when created with no label', function() {
            button.getLabel().should.equal( '&nbsp;' );
        } );

        it( 'should have a label of hello when setLabel("hello")', function() {
            button.setLabel( 'hello' );
            button.getLabel().should.equal( 'hello' );
        } );

        it( 'should have a label when created with one', function() {
            var buttonOptions = createOptions(),
                button;

            buttonOptions.label = 'Hello World';
            button = new ButtonComponent( buttonOptions );
            button.getLabel().should.equal( 'Hello World' );

        } );
    } );

    describe( '#click', function() {

        var button,
            closureComponent,
            testClosure,
            functionRan = false,
            options = createOptions();

        testClosure = function( component ) {
            closureComponent = component;
            functionRan = true;
        };

        options.callback = testClosure;

        it( 'should return the component in closure', function() {
            button = new ButtonComponent( options );

            button.buttonClickHandler( mockClickEvent );
            closureComponent.should.be.instanceof( ButtonComponent );
            functionRan.should.equal( true );
        } );

        it( 'should not invoke the closure if disabled', function() {

            var button = new ButtonComponent( options );

            //reset the test values
            functionRan = false;
            closureComponent = null;

            button.disable();

            button.buttonClickHandler( mockClickEvent );

            functionRan.should.equal( false );

        } );

    } );

} );