// Create a function to log the response from the Mandrill API
var firstname, lastname, verifyemail, signupemail, buyinggroup;
var params = {};
function log(obj) {
    $('#response').text(JSON.stringify(obj));
}
var m = new mandrill.Mandrill('JU-57-H2ZOybh2O8UXG4iw');
//plug form data into variables

// create a variable for the API call parameters
function buildParams (firstname, lastname, verifyemail, buyinggroup) {
    params = {
        "message": {
            "from_email":"webhosting@millenniumgd.com",
            "to":[{"email":"webhosting@millenniumgd.com"}],
            "subject": "New Signup Request",
            "html": "<p>You Have a new signup request. The Details are as follows: </p><br /><ul><li>Name: " + firstname + " " + lastname +".</li><li>Email Address: " + signupemail + ".</li><li>Buying Group: "+ buyinggroup + ".</li></ul><p>Please respond to the request within one business day!</p>"
        }
    };
}
function sendtheMail() {
// Send the email!
    if (doValidate()) {
        m.messages.send(params, function(res) {
            $(".signupinput").val('');
            alert("Request submission complete. Please give us a business day to respond. You will receive an email with login details shortly. Thank you!");
            $( ":mobile-pagecontainer" ).pagecontainer( "change", "#login", { transition: "flip" } );
        }, function(err) {
            alert(err);
        });
        
    }
    
}

function doValidate() {
    var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    firstname = $("[name = 'signup_firstname']").val();
    lastname = $("[name = 'signup_lastname']").val();
    verifyemail = $("[name = 'signup_verifyemail']").val();
    signupemail = $("[name = 'signup_email']").val();
    buyinggroup = $("[name = 'signup_groupname']").val();
    $("#response").text("");
    if (buyinggroup == "") {
        $("#response").text("Name of Buying Group cannot be blank.");
        return false;
    }
    else if (signupemail == "") {
        $("#response").text("Email Address cannot be blank.");
        return false;
    }
    else if ( signupemail != verifyemail ) {
        $("#response").text("Email addresses must match.");
        return false;      
    }
    else if (!filter.test(signupemail)) {
        $("#response").text("Email address must be in format email@address.com");
        return false;  
    }
    else {
        buildParams(firstname, lastname, signupemail, buyinggroup);
        return true;
    }
    
}