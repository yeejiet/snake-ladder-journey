$(document).ready(function() {
    $('#username').on('input', function() {
        var username = $('#username').val();
        $.ajax({
            url: '/checkUsername',
            data: { username: username },
            success: function(data) {
                if (data.exists) {
                    $('#register-button').prop('disabled', true);
                    $('#register-button').css({
                        'background-color': '#ff7f6e',
                        'color': '#fff',
                        'border': '#ff7f6e 2px solid'
                    }); 
                    $('#username').css('background-color', '#ffc0b8');
                    $('#username-error').text('Username already registered!').css('color', 'red');
                } else {
                    $('#register-button').prop('disabled', false);
                    $('#username').css('background-color', '#d7ffb8');
                    $('#register-button').css({
                        'background-color': '',
                        'color': '',
                        'border': ''
                    }); 
                    $('#username-error').text('Username is available!').css('color', 'green');
                }
            }
        });
    });

    // Reset button event listener
    $('#registration-form').on('reset', function() {
        $('#username-error').text('');
        $('#username').css('background-color', '');
        $('#register-button').prop('disabled', false).css({
            'background-color': '',
            'color': '',
            'border': ''
        });
    });
});
