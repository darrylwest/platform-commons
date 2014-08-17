/**
 *
 * @copyright Copyright &copy; 2014 Waterous
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/1/14 11:44 AM
 */
describe('MessageService', function() {
    'use strict';

    var log = new RemoteLogger('MessageService', RemoteLogger.ERROR ),
        createOptions;

    createOptions = function() {
        var opts = Config.test();

        opts.log = log;
        opts.client = new MockMessageClient();
        opts.channel = '/gauge';

        return opts;
    };

    describe('#instance', function() {
        var service = new MessageService( createOptions() ),
            methods = [
                'addSubscriber',
                'publish'
            ];

        it('should create an instance of MessageService', function() {
            should.exist( service );
            service.should.be.instanceof( MessageService );
        });

        it( 'should contain all known methods based on method count and type', function() {
            dash.methods( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a('function');
            });
        });
    });
});
