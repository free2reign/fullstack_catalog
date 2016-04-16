/*
 * Google Plus sign in callback function
 */
function signInCallback(authResult) {
    if (authResult['code']) {
        // Hide the sign-in button now that the user is authorized
        $('.signInButton').attr('style', 'display: none');

        // Send the one-time-use code to the server, if the server responds, write a 'login successful' message to the web page and then redirect back to the main restaurants page
        $.ajax({
            type: 'POST',
            url: '/gconnect?state='+stateToken+'',
            processData: false,
            data: authResult['code'],
            contentType: 'application/octet-stream; charset=utf-8',
            success: function(result) {
                // Handle or verify the server response if necessary.
                if (result) {
                    $('#result').html('Login Successful!</br>' + result + '</br>Redirecting...')
                    setTimeout(function() {
                        window.location.href = "/";
                    }, 4000);

                } else if (authResult['error']) {
                    console.log('There was an error: ' + authResult['error']);
                } else {
                    $('#result').html('Failed to make a server-side call. Check your configuration and console.');
                }
            }

        });
    }
}

/*
 * Facebook sign in functions
 */
window.fbAsyncInit = function() {
    FB.init({
        appId: '481612878691113',
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.2' // use version 2.2
    });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function sendTokenToServer() {
    // Hide the sign-in button now that the user is authorized
    $('.signInButton').attr('style', 'display: none');

    var access_token = FB.getAuthResponse()['accessToken'];
    console.log(access_token)
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        $.ajax({
            type: 'POST',
            url: '/fbconnect?state='+stateToken+'',
            processData: false,
            data: access_token,
            contentType: 'application/octet-stream; charset=utf-8',
            success: function(result) {
                // Handle or verify the server response if necessary.
                if (result) {
                    $('#result').html('Login Successful!</br>' + result + '</br>Redirecting...')
                    setTimeout(function() {
                        window.location.href = "/";
                    }, 4000);

                } else {
                    $('#result').html('Failed to make a server-side call. Check your configuration and console.');
                }
            }

        });
    });
}
