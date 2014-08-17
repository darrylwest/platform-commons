/**
 * ComponentBuilderDelegateTests -
 *
 * @see http://chaijs.com/guide/styles/#should for syntax reference
 *
 * @created: 17/02/2014.
 * @author: darryl.west@roundpeg.com
 */

describe( 'ComponentBuilderDelegate', function() {
    'use strict';

    var createComponentBuilderDelegate,
        dataset = new TestDataset(),
        config = dataset.createMockConfiguration();

    createComponentBuilderDelegate = function() {

        var opts = Config.test(),
            applicationFactory,
            delegateFactory,
            componentBuilderDelegate;

        opts.createLogger = function( name, level ) {
            if ( !level ) {
                level = RemoteLogger.ERROR + 1;
            }
            return new RemoteLogger( name, level );
        };

        applicationFactory = new ApplicationFactory( opts );
        delegateFactory = applicationFactory.createDelegateFactory();

        componentBuilderDelegate = delegateFactory.createComponentBuilderDelegate();

        return  componentBuilderDelegate;

    };

    describe( '#instance', function() {
        var builder = createComponentBuilderDelegate(),
            methods = [
                'createDomElement',
                'createButtonComponent'
            ];

        it( 'should create an instance of ComponentBuilderDelegate', function() {
            should.exist( builder );
            builder.should.be.instanceof( ComponentBuilderDelegate );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( builder ).length.should.equal( methods.length );
        } );

        it( 'should execute all known methods', function() {
            var obj,
                component = document.createElement( 'div' );

            methods.forEach( function( method ) {

                if ( method === 'createDischargeButtonComponent' ) {

                } else if ( method.indexOf( 'Component' ) > 3 ) {
                    builder[ method ]( component );
                } else {
                    obj = builder[ method ]();
                    should.exist( obj );
                }

            } );
        } );
    } );

    describe( '#created', function() {

        it( 'should create an HTML element', function() {
            var builder = createComponentBuilderDelegate(),
                element = builder.createDomElement( 'div', null, null );

            element.should.be.instanceof( HTMLElement );

            element.id.should.equal( '' );
            element.className.should.equal( '' );

            element = builder.createDomElement( 'div', 'testClass', 'testId' );

            element.id.should.equal( 'testId' );
            element.className.should.equal( 'testClass' );
        } );


    } );

});