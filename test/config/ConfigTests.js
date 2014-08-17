/**
 * ConfigTests - insure that each environment loads and that all known variables exist.
 *
 * TODO: test that variables have proper values for known environments
 *
 * @see http://chaijs.com/guide/styles/#should for syntax reference
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2/12/14
 */
describe( 'Config', function() {
    'use strict';

    describe( '#instance', function() {
        it( 'should create an instance of Config', function() {
            var config = new Config( 'myenv' );

            should.exist( config );
            config.should.be.instanceof( Config );
            config.environment.should.equal( 'myenv' );
        } );

        it( 'should create an instance of Config.development', function() {
            var config = Config.development();

            should.exist( config );
            config.should.be.instanceof( Config );
            config.environment.should.equal( 'development' );
        } );

        it( 'should create an instance of Config.staging', function() {
            var config = Config.staging();

            should.exist( config );
            config.should.be.instanceof( Config );
            config.environment.should.equal( 'staging' );
        } );

        it( 'should create an instance of Config.test', function() {
            var config = Config.test();

            should.exist( config );
            config.should.be.instanceof( Config );
            config.environment.should.equal( 'test' );
        } );

        it( 'should create an instance of Config.production', function() {
            var config = Config.production();

            should.exist( config );
            config.should.be.instanceof( Config );
            config.environment.should.equal( 'production' );
        } );
    } );

    describe( 'variables', function() {
        it( 'should contain the correct variable key names', function() {
            var config = Config.development(),
                keys = [
                    'environment',
                    'version',
                    'appkey',
                    'usekey',
                    'appItemKey',
                    'copyright',
                    'publisherId',
                    'vendorKey',
                    'configurationHostURL',
                    'dataHostURL',
                    'dataURI',
                    'socketClientURL',
                    'pageTitle',
                    'enableLogMessagePublisher'
                ];

            keys.forEach( function( key ) {
                if ( !config.hasOwnProperty( key ) ) {
                    console.log( 'key: ', key );
                }
                config.hasOwnProperty( key ).should.equal( true );
            } );

            dash.keys( config ).length.should.equal( keys.length );
        } );
    } );
} );