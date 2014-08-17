// could write to a file as well...

module.exports = {
    reporter: function(errors) {
        errors.forEach(function(msg) {
            var msg = [
                msg.file,
                ' line:',
                msg.error.line,
                '/',
                msg.error.character,
                '\t:',
                msg.error.reason,
                ' (',
                msg.error.code,
                ')'
            ].join('');

            console.log( msg );
        });

        console.log( errors.length ? '\nfail with ' + errors.length + ' errors' : '\nok');
    }
};
