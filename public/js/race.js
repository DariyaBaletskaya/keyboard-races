window.onload = () => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
        location.replace('/login');
    } else {
        const path = 'http://localhost:3000';
        const socket = io.connect(path);

        socket.emit('auth', { token: jwt });

        socket.on('game-start', payload => {
            //add players' progress-bars
            const newPlayerLable = document.createElement('span');
            newPlayerLable.innerHTML = payload.user;

            const newProgressBar = document.createElement('progress');
            newProgressBar.classList.add('race-progress');
            newProgressBar.setAttribute("value", "0");
            newProgressBar.setAttribute("max", "100");

            const newPBContainer = document.createElement('div');
            newPBContainer.classList.add('indicator-wrapper');
            newPBContainer.append(newPlayerLable, newProgressBar);

            document.getElementById('indicator-placeholder').appendChild(newPBContainer);

            //get random text from the server
            const textContainer = document.getElementById('race-text');
            const textInput = document.getElementById('race-input');
            const raceText = payload.randomText.text;

            textInput.addEventListener('input', e => {
                // change letter colours depending on correctness of user input
                for (let i = 0; i < textInput.value.length; i++) {

                    if (textInput.value[i] == raceText[i]) {
                        //correct input
                        textContainer.innerHTML = [
                            raceText.substr(0, i),
                            '<span style="background-color: green; text-style: bold;">',
                            raceText.substr(i, 1),
                            '</span>',
                            raceText.substr(++i)
                        ].join("");

                        //change progress-bar value 
                        const MAX_PB_VALUE = 100;
                        //count percent of progress
                        const pbValue = (MAX_PB_VALUE * i) / raceText.length;
                        newProgressBar.setAttribute("value", Math.floor(pbValue));

                        if (newProgressBar.value == 100) {
                            socket.emit('game-win');
                        }
                    } else {
                        //incorrect input
                        textContainer.innerHTML = [
                            raceText.substr(0, i),
                            '<span style="background-color: red; text-style: bold;">',
                            raceText.substr(i, 1),
                            '</span>',
                            raceText.substr(++i)
                        ].join("");
                    }
                }
            });

            //set up countdown
            socket.on('countdown', payload => {
                let gameTimer = 0;

                if (payload.countdown === 0) {
                    //set random text from the server
                    textContainer.innerHTML = raceText;
                    //set up game timer
                    socket.on('game-timer', () => {
                        timeTitle.innerHTML = `${gameTimer++}s`;
                    });
                }

                const timeTitle = document.getElementById('time-value-title');
                timeTitle.innerHTML = `The next race starts in: ${payload.countdown}s`;

            });
        });

        socket.on('join-user', payload => {
            document.getElementById('game-info-placeholder')
                .innerHTML += ` <b>${payload.user}</b> has been connected <br/>`;
        });

        socket.on('show-winner', payload => {
            alert(`The winner is ${payload.user}!`);
            location.reload();
        });

        socket.on('disconnect-user', payload => {
            document.getElementById('game-info-placeholder')
                .innerHTML += `<b>${payload.user}</b> has been disconnected <br/>`;
        })
    }

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', e => {
        localStorage.removeItem('jwt');
        location.replace('/');
    });

}
