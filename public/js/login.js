window.onload = () => {
    const formLogin = document.getElementById('form-login');
        const usernameField = document.getElementById('username');
        const passwdField = document.getElementById('password');

        formLogin.addEventListener('submit', ev => {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameField.value,
                    password: passwdField.value
                })
            }).then(res => {
                res.json().then(body => {
                    console.log(body);
                    if (body.auth) {
                        localStorage.setItem('jwt', body.token);
                        location.replace('/race');
                    } else {
                        console.log('auth failed');
                    }
                })
            }).catch(err => {
                console.log('request went wrong');
            })
        });
}
        

    
   