

// DOM Ready =============================================================
$(document).ready(function() {
    // Add User button click
    $('#btnAddUser').on('click', addUser);
    // Login button click
    $('#btnLogin').on('click', login);

    if($.cookie("name") && $.cookie("password"))
        loginHelper($.cookie("name"), $.cookie("password"), true);
});

// Functions =============================================================

// Login
function login(event) {
    event.preventDefault();

    //check for empty inputs
    $('#login input').each(function(index, val) {
        if($(this).val() === '') {
            alert('Please fill in all fields');
            return false;
        }
    });

    //check if cookies are valid


    // Fetch name and password fields
    var fullname = $('#login fieldset input#inputFullNameLogin').val();
    var password = $('#login fieldset input#inputPasswordLogin').val();

    loginHelper(fullname, password, false);
}

function loginHelper(name, password, silent) {
    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'GET',
        url: '/users/login/' + name + '/' + password,
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.retStatus == 'Success') {

            // Clear the form inputs
            $('#addUser fieldset input').val('');
            $.cookie("name", name);
            $.cookie("password", password)
            // Send to map page
            window.location = response.redirectTo;
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            if(!silent) alert('Error: ' + response.retStatus);

        }
    });
}

// Add User
function addUser(event) {
    event.preventDefault();

    //check for empty inputs
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') {
            alert('Please fill in all fields');
            return false;
        }
    });
    //check for improper phone number
    var phone = $('#addUser input#inputPhone').val();

    // If it is, compile all user info into one object
    var newUser = {
        'hashkey': $('#addUser fieldset input#inputHashkey').val(),
        'fullname': $('#addUser fieldset input#inputFullName').val(),
        'phone': $('#addUser fieldset input#inputPhone').val(),
        'password': $('#addUser fieldset input#inputPassword').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: newUser,
        url: '/users/adduser/' + $('#addUser fieldset input#inputHashkey').val(),
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {

            // Clear the form inputs
            $('#addUser fieldset input').val('');

            // Send to map page
            window.location = response.redirectTo;
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });
};