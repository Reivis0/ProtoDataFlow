const form = document.getElementById('loginForm');
const login = document.getElementById('login-in');
const password = document.getElementById('password-in');
const error_div = document.getElementById('errorMessage');

//учимся делать новые ветки

form.addEventListener('submit', (e) => {

    let pair = new Object();  //собрать данные для отправки
    pair.login = login.value;
    pair.password = password.value;
    let jsonstr = JSON.stringify(pair);

    /*
    e.preventDefault();
    fetch('http://127.0.0.1:8080/api/auth', { //что тут происходит я сам не знаю
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonstr,
      }
    
    )
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {

        if(data.status === 'Correct') { //если все хорошо
            alert('we are in if');
            sessionStorage.setItem('GlobalLogin', login.value);
            sessionStorage.setItem('GlobalLevel', data.privilege);
            //sessionStorage.setItem("GlobalRedirect", true);
            e.preventDefault();  
            if(data.access){  
                if(!data.agreement) {
                    window.location.assign("rules-of-usage.html");
                }
                else{
                    window.location.assign("data-from-user.html");
                }
            }
            else {
                error_div.innerText = "Доступ закончился";
                e.preventDefault();
            }
    
        }
        else if (data.status === 'User not found'){
            alert('we are in another if')
            error_div.innerText = "Неправильный логин";
            e.preventDefault();
        }
        else if (data.status === 'Incorrect password'){
            error_div.innerText = "Неправильный пароль";
            e.preventDefault();
        }
        else {alert(data.status === 'User not found')};
        alert(data.status === 'User not found');


    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    */
    
    let jsonanswer = tempCheckLoginAndPassword(jsonstr);
    let answer = JSON.parse(jsonanswer); //ответ от сервера
    if(answer.status === 'Correct') { //если все хорошо
        sessionStorage.setItem('GlobalLogin', login.value);
        sessionStorage.setItem('GlobalLevel', answer.privilege);
        //sessionStorage.setItem("GlobalRedirect", true);
        e.preventDefault();  
        if(answer.access === 'true'){  
            if(answer.agreement === 'false') {
                window.location.assign("rules-of-usage.html");
            }
            else{
                window.location.assign("data-from-user.html");
            }
        }
        else {
            error_div.innerText = "Доступ закончился";
            e.preventDefault();
        }

    }
    else if (answer.status === 'User not found'){
        error_div.innerText = "Неправильный логин";
        e.preventDefault();
    }
    else if (answer.status === 'Incorrect password'){
        error_div.innerText = "Неправильный пароль";
        e.preventDefault();
    }
    

})

const twoInputs = [login, password];

twoInputs.forEach(input => { //стереть сообщение об ошибке когда исправляют данные
    input.addEventListener('input', () => {
        error_div.innerText = '';
    })
})


function tempCheckLoginAndPassword(jsonstr){
    return tempFunction(jsonstr);
}

function tempFunction(jsonstr) { // 123 123 - user без согласияб 321 321 - admin с согласием, 222 222 - доступ кончился по времени
    let temp = JSON.parse(jsonstr);
    let obj = new Object();
    if (temp.login === '123' && temp.password === '123') {
        obj.status = 'Correct';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'true';
    }
    else if (temp.login === '321' && temp.password === '321') {
        obj.status = 'Correct';
        obj.privilege = 'admin';
        obj.agreement = 'true';
        obj.access = 'true';
    }
    else if (temp.login === '222' && temp.password === '222'){
        obj.status = 'Correct';
        obj.privilege = 'user';
        obj.agreement = 'true';
        obj.access = 'false';
    }
    else if (temp.login !== '321' && temp.login !== '123'){
        obj.status = 'User not found';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'false';
    }

    else if (temp.password !== '321' && temp.password !== '123'){
        obj.status = 'Incorrect password';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'false';
    }

    return JSON.stringify(obj);
}
