window.onload = () => {
        const loginBtn = document.getElementById('login-btn');
        const usernameField = document.getElementById('username');
        const passwdField = document.getElementById('password');

        loginBtn.addEventListener('click', ev => {
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
                    if (body.auth) {
                        localStorage.setItem('jwt', body.token);
                        location.replace('/race');
                        
                        return fetch('/race', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `JWT ${body.token}`
                            }
                        });
                    }  else {
                        console.log('auth failed');
                    }
                })
            }).catch(err => {
                console.log('request went wrong');
            })
        });
}
        

