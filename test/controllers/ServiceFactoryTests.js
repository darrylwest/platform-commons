/**
 * @class ServiceFactoryTests
 *
 * @copyright Copyright &copy; 2014 Waterous
 *
 * @see http://chaijs.com/guide/styles/#should for syntax reference
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2/17/14
 */
describe( 'ServiceFactory', function() {
    'use strict';

    var config = Config.test(),
        log = new RemoteLogger( 'ServiceFactoryTests', RemoteLogger.ERROR ),
        options = dash.clone( config );

    options.log = log;
    options.dispatcher = new CentralDispatcher();

    options.createLogger = function( name ) {
        return new RemoteLogger( name, RemoteLogger.ERROR );
    };

    options.agent = superagent;

    describe( '#instance', function() {
        var factory = new ServiceFactory( options ),
            methods = [
                'createConfigurationService',
                'createLogMessagePublisher',
                'createSessionLogSubscriber',
                'createMessageService'
            ];

        it( 'should create an instance of ServiceFactory', function() {
            should.exist( factory );
            factory.should.be.instanceof( ServiceFactory );
        } );

        it( 'should contain all known methods based on method count', function() {
            dash.methods( factory ).length.should.equal( methods.length );
        } );

        it( 'should execute all known create methods', function() {
            var opts = Config.test();
            opts.channel = '/test';

            methods.forEach( function( method ) {
                factory.hasOwnProperty( method ).should.equal( true );
                factory[ method ].should.be.a( 'function' );

                if ( method.indexOf( 'create' ) === 0 ) {
                    var obj = factory[ method ]( dash.clone( opts ) );

                    should.exist( obj );
                }
            } );
        } );
    } );

    describe( '#servies', function() {
        var factory = new ServiceFactory( options );

        it( 'should create configuration service', function() {
            var service = factory.createConfigurationService();
            should.exist( service );
            service.query.should.be.a( 'function' );
        } );

    } );
} );
