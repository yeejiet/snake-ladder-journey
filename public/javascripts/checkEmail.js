$(document).ready(function() {
    $('#email').on('input', function() {
        var email = $('#email').val();
        $.ajax({
            url: '/checkEmail',
            data: { email: email },
            success: function(data) {
                if (data.exists) {
                    $('#register-button').prop('disabled', true);
                    $('#register-button').css({
                        'background-color': '#ff7f6e',
                        'color': '#fff',
                        'border': '#ff7f6e 2px solid'
                    }); 
                    $('#email').css('background-color', '#ffc0b8');
                    $('#email-error').text('Email already registered!').css('color', 'red');
                } else {
                    $('#register-button').prop('disabled', false);
                    $('#email').css('background-color', '#d7ffb8');
                    $('#register-button').css({
                        'background-color': '',
                        'color': '',
                        'border': ''
                    }); 
                    $('#email-error').text('Email is available!').css('color', 'green');
                }
            }
        });
    });

    // Reset button event listener
    $('#registration-form').on('reset', function() {
        $('#email-error').text('');
        $('#email').css('background-color', '');
        $('#register-button').prop('disabled', false).css({
            'background-color': '',
            'color': '',
            'border': ''
        });
    });
});
