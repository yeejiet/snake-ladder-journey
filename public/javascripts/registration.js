$(document).ready(function() {
    $('#registration-form').on('submit', function(event) {
        let isValid = true;

        // Clear previous error messages and error states
        $('.form-control').removeClass('is-invalid is-valid');
        $('.err-msg').text('');

        const username = $('#username').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        // Validate username
        if (username === '') {
            $('#username').addClass('is-invalid');
            $('#username-error').text('Username is required.').css('color', 'red');
            isValid = false;
        } else if (username.length < 1) {
            $('#username').addClass('is-invalid');
            $('#username-error').text('Username must be at least 1 characters long.').css('color', 'red');
            isValid = false;
        } else {
            $('#username').removeClass('is-invalid').addClass('is-valid');
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            $('#email').addClass('is-invalid');
            $('#email-error').text('Email is required.').css('color', 'red');
            isValid = false;
        } else if (!emailPattern.test(email)) {
            $('#email').addClass('is-invalid');
            $('#email-error').text('Please enter a valid email address.').css('color', 'red');
            isValid = false;
        } else {
            $('#email').removeClass('is-invalid').addClass('is-valid');
        }

        // Validate password
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password === '') {
            $('#password').addClass('is-invalid');
            $('#password-error').text('Password is required.').css('color', 'red');
            isValid = false;
        } else if (!passwordPattern.test(password)) {
            $('#password').addClass('is-invalid');
            $('#password-error').text('Password must be at least 8 characters long, include at least one number, one uppercase letter, and one special character.').css('color', 'red');
            isValid = false;
        } else {
            $('#password').removeClass('is-invalid').addClass('is-valid');
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

    // Reset button event listener
    $('#registration-form').on('reset', function() {
        $('.form-control').removeClass('is-invalid is-valid');
        $('.err-msg').text('');
    });

    // Username availability check
    $('#username').on('input', function() {
        var username = $(this).val().trim();
        if (username === '') {
            $('#username').removeClass('is-invalid is-valid');
            $('#username-error').text('');
            return;
        }
        $.ajax({
            url: '/checkUsername',
            method: 'POST',
            data: { username: username },
            success: function(data) {
                if (data.exists) {
                    $('#username').addClass('is-invalid').removeClass('is-valid');
                    $('#username-error').text('Username already registered!').css('color', 'red');
                } else {
                    $('#username').addClass('is-valid').removeClass('is-invalid');
                    $('#username-error').text('Username is available!').css('color', 'green');
                }
            },
            error: function(err) {
                console.error('Error checking username availability:', err);
            }
        });
    });

    // Email availability check
    $('#email').on('input', function() {
        var email = $(this).val().trim();
        if (email === '') {
            $('#email').removeClass('is-invalid is-valid');
            $('#email-error').text('');
            return;
        }
        $.ajax({
            url: '/checkEmail',
            method: 'POST',
            data: { email: email },
            success: function(data) {
                if (data.exists) {
                    $('#email').addClass('is-invalid').removeClass('is-valid');
                    $('#email-error').text('Email already registered!').css('color', 'red');
                } else {
                    $('#email').addClass('is-valid').removeClass('is-invalid');
                    $('#email-error').text('Email is available!').css('color', 'green');
                }
            },
            error: function(err) {
                console.error('Error checking email availability:', err);
            }
        });
    });
});
