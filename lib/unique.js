/**
 * darryl.west@roundpeg.com
 */

var UniqueLib = { VERSION: '2013.11.17-9470' };

var UUID = {
    create: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g,
            function( c ) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString( 16 );
            }
        );
    }
};

var UID = {
    create: function( name ) {
        if ( name ) {
            name = name.trim();
        } else {
            name = 'UID';
        }

        var t = [
            name,
            (Math.floor( Math.random() * 16 )).toString( 22 ),
            new Date().getTime().toString( 19 ),
            (Math.floor( Math.random() * 0x1000 )).toString( 22 )
        ];

        return t.join( '' );
    }
};
