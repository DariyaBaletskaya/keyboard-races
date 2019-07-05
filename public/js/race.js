window.onload = () => {
const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        location.replace('/login');
    } else {
        const path = 'http://localhost:3000';
        const socket = io.connect(path);

        const textContainer = document.getElementById('race-text');
        const textInput = document.getElementById('race-input');

        socket.on('race-start', payload => {
            const raceText = payload.randomText.text;
            textContainer.innerHTML = raceText;
            textInput.addEventListener('input', e => {

              for(let i = 0; i < textInput.value.length; i++) {
                if(textInput.value[i] == raceText[i]){
                    textContainer.innerHTML = [
                        raceText.substr(0,i),
                        '<span style="background-color: green; text-style: bold;">',
                        raceText.substr(i,1),
                        '</span>',
                        raceText.substr(++i)
                    ].join("");

                } else {
                    textContainer.innerHTML = [
                        raceText.substr(0,i),
                        '<span style="background-color: red; text-style: bold;">',
                        raceText.substr(i,1),
                        '</span>',
                        raceText.substr(++i)
                    ].join("");

                }
              }
            });
           
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', e => {
        localStorage.removeItem('jwt');
        console.log("here");
    });
}