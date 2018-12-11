/// REGISTRATION AUTH
$('#createAccount').on('click', function(event){
    event.preventDefault();
    const user = {
        username: $("#username").val(),
        password: $("#userpass").val(),
        passwordConf: $("#userpassconf").val()
    }
    console.log(user);
    alert('User Created! You may now log in.');
    $.post('/api/register', user, function(response){
        console.log(response);
    })
})

/// LOGIN AUTHENTICATION /////
$('#LoginAccount').on('click', function(event){
    event.preventDefault();
    const user = {
        username: $("#loginuser").val(),
        password: $("#loginpass").val()
    }

    $.post('/api/login', user, function(response){
        console.log(response);
        if (response.success == true) {
            window.location.href = '/login';
        } else {
            alert('Invalid credentials. Please register.')

        }
    })

})

