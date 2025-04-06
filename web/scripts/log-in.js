const form = document.getElementById('loginForm');
const login = document.getElementById('login-in');
const password = document.getElementById('password-in');
const error_div = document.getElementById('errorMessage');

//учимся делать новые ветки

form.addEventListener('submit', (e) => {

    let pair = new Object();  //собрать данные для отправки
    pair.login = login.value;
    pair.password = password.value;
    let jsonstr = JSON.stringify(pair)

    let jsonanswer = tempCheckLoginAndPassword(jsonstr);
    let answer = JSON.parse(jsonanswer); //ответ от сервера

    //let answer = PostFunction(jsonstr); 

    alert(jsonanswer);
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

/*
async function checkLoginAndPassword(jsonstr){
    //alert(jsonstr); //вывод в браузер что передается

    url = sessionStorage.getItem("GlobalUrl");

    try {
        const response = await fetch(url, { //что тут происходит я сам не знаю
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonstr,
        });
    
        if (!response.ok) {
          throw new Error(`Login failed with status: ${response.status}`);
        }
    
        let authData = await response.json();
        alert(response);
        alert('Authentication successful');
        return authData;
        
        
      } catch (error) {
        console.error('Login error:', error);
        alert("Error");
      }
} */

function tempCheckLoginAndPassword(jsonstr){
    alert(jsonstr);
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
