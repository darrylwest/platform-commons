/**
 * ComponentGroupDelegateTests - description
 *
 * @author steve@roundpeg.com
 * @created 4/1/14 7:48 AM
 *
 *
 */

describe( 'ComponentGroupDelegate', function() {
    "use strict";

    var log = new RemoteLogger( 'ComponentGroupDelegateTests', RemoteLogger.ERROR + 1 ),
        mockDelegateFactory = new MockDelegateFactory(),
        dataset = new TestDataset(),
        buttons = dataset.createButtons(),
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

        var methods = [
                'add',
                'remove',
                'select',
                'getSelected',
                'clearAllSelected',
                'enableAll',
                'getComponents',
                'disableAll'
            ],
            delegate = new ComponentGroupDelegate( createOptions() );


        it( 'should create an instance of ComponentGroupDelegate', function() {
            should.exist( delegate );
            delegate.should.be.instanceof( ComponentGroupDelegate );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( delegate ).length.should.equal( methods.length );
        } );

        it( 'should execute all known create methods', function() {

            methods.forEach( function( method ) {
                delegate.hasOwnProperty( method ).should.equal( true );
                delegate[ method ].should.be.a( 'function' );

                if ( method.indexOf( 'create' ) === 0 ) {
                    var obj = delegate[ method ]();

                    should.exist( obj );
                }
            } );
        } );

    } );

    describe( '#addRemove', function() {

        var delegate = new ComponentGroupDelegate( createOptions() );

        buttons.forEach( function( button ) {
            delegate.add( button );
        } );

        it( 'should a length that matches the control group', function() {

            delegate.getComponents().length.should.equal( buttons.length );

        } );

        it( 'should not add duplicate components to the group', function() {

            delegate.getComponents().length.should.equal( buttons.length );

            try {
                delegate.add( buttons[0] );
                delegate.add( buttons[1] );
            } catch ( e ) {
                delegate.getComponents().length.should.equal( buttons.length );
            }

            delegate.remove( buttons[0] );

            delegate.getComponents().length.should.equal( buttons.length - 1 );

            delegate.add( buttons[0] );

            delegate.getComponents().length.should.equal( buttons.length );
        } );

        it( 'should remove components from the group', function() {

            delegate.getComponents().length.should.equal( buttons.length );

            delegate.remove( buttons[0] );

            delegate.getComponents().length.should.equal( buttons.length - 1 );
        } );

    } );


    describe( '#selected', function() {

        var delegate = new ComponentGroupDelegate( createOptions() ),
            selectedCount = 0;

        buttons.forEach( function( button ) {
            delegate.add( button );
        } );

        it( 'should set only 1 item selected', function() {

            delegate.select( buttons[1] );
            buttons[1].isSelected().should.equal( true );

            delegate.select( buttons[2] );
            buttons[2].isSelected().should.equal( true );
            buttons[1].isSelected().should.equal( false );


            delegate.getComponents().forEach( function( item ) {
                if ( item.isSelected() ) {
                    selectedCount++;
                }
            } );

            selectedCount.should.equal( 1 );
        } );

        it( 'should set only no item selected', function() {

            selectedCount = 0;

            delegate.clearAllSelected();

            delegate.getComponents().forEach( function( item ) {

                if ( item.isSelected() ) {
                    selectedCount++;
                }
            } );

            selectedCount.should.equal( 0 );
        } );

    } );

    describe( '#enableDisable', function() {

        var delegate = new ComponentGroupDelegate( createOptions() ),
            disabledCount = 0;

        buttons.forEach( function( button ) {
            delegate.add( button );
        } );

        it( 'should disable all buttons', function() {

            delegate.disableAll();

            delegate.getComponents().forEach( function( item ) {
                if ( item.isDisabled() ) {
                    disabledCount++;
                }
            } );

            disabledCount.should.equal( buttons.length );
        } );

        it( 'should enable all buttons', function() {

            disabledCount = 0;

            delegate.enableAll();

            delegate.getComponents().forEach( function( item ) {
                if ( item.isDisabled() ) {
                    disabledCount++;
                }
            } );

            disabledCount.should.equal( 0 );
        } );

    } );

} );
