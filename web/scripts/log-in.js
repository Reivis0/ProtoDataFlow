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

    //localStorage.clear();

    
    e.preventDefault();
    // fetch('http://127.0.0.1:8080/api/auth', { //что тут происходит я сам не знаю
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: jsonstr,
    //   }
    
    // )
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json(); 
    // })
    // .then(data => {

    //     if(data.status === 'Correct') { //если все хорошо
    //         sessionStorage.setItem('GlobalLogin', login.value);
    //         sessionStorage.setItem('GlobalLevel', data.privilege);
    //         //sessionStorage.setItem("GlobalRedirect", true);
    //         e.preventDefault();  
    //         if(data.access){  
    //             if(!data.agreement) {
    //                 window.location.assign("rules-of-usage.html");
    //             }
    //             else{
    //                 window.location.assign("information-about-model.html");
    //             }
    //         }
    //         else {
    //             error_div.innerText = "Доступ закончился";
    //             e.preventDefault();
    //         }
    
    //     }
    //     else if (data.status === 'User not found'){
    //         error_div.innerText = "Неправильный логин";
    //         e.preventDefault();
    //     }
    //     else if (data.status === 'Incorrect password'){
    //         error_div.innerText = "Неправильный пароль";
    //         e.preventDefault();
    //     }

    // })
    // .catch(error => {
    //     console.error('Error fetching data:', error);
    // });
    
    
    let jsonanswer = tempCheckLoginAndPassword(jsonstr);
    let answer = JSON.parse(jsonanswer); //ответ от сервера
    if(answer.status === 'Correct') { //если все хорошо
        sessionStorage.setItem('GlobalLogin', login.value);
        sessionStorage.setItem('GlobalLevel', answer.privilege);
        e.preventDefault();  
        if(answer.access){ 
           
            // fetch(ServerAdress + `load?${pair.login}`
            // // fetch(ServerAdress + `load?${pair.login}`, { //что тут происходит я сам не знаю
            // //     method: 'POST',
            // //     headers: {
            // //     'Content-Type': 'application/json',
            // //     },
            // //     body: pair.login,
            // // }
            
            // )
            // .then(response => {
            //     if (!response.ok) {
            //         throw new Error(`HTTP error! status: ${response.status}`);
            //     }
            //     return response.json(); 
            // })
            // .then(data => {
            //     //получить данные о моделях и другие
            //     //{specialFieldForModels_ddqasdawd: null, data_awdfasda: null})
            //     localStorage.setItem(`data-${pair.login}`, JSON.stringify(data));
            // })
            // .catch(error => {
            //     console.error('Error fetching data:', error);
            // });
            
            if(!answer.agreement) {
                window.location.assign("rules-of-usage.html");
            }
            else{
               window.location.assign("information-about-model.html");
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
    let input = JSON.parse(jsonstr);
    let obj = new Object();
    //console.log(localStorage.getItem("all-users"));
    if(!localStorage.getItem("all-users")){
        localStorage.setItem("all-users", JSON.stringify([
        { id: 1, level: "superAdmin", surname: "fsafasf", name: "dfdfsdf", patronymic: "dfaffdsaf", login: "111", password: "111", acsess: true,
          startDate: new Date("1970-02-03"), endDate: new Date("2095-02-03"), email: "asfas@mail.com", phone: 54345, comment: "dfdsfd", agreement: false}]));

        localStorage.setItem("data-111", JSON.stringify({specialFieldForModels_ddqasdawd: null, data_awdfasda: null})); //такое название поля чтобы точно не совпало с названиями модели
    }

    // fetch(ServerAdress + `getUsers`)
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json(); 
    // })
    // .then(data => {
    //     const AllUsers = data;
    //     let flag = true;
    //     for(let i = 0; i < AllUsers.length; ++i){
    //         if(AllUsers[i].login === input.login){
    //             flag = false;
    //             if(AllUsers[i].password === input.password){
    //                 const currTime = new Date();
    //                 if(AllUsers[i].acsess && (AllUsers[i].startDate ? new Date(AllUsers[i].startDate) <= currTime : true) && (AllUsers[i].endDate ? currTime <= new Date(AllUsers[i].endDate) : true)){
    //                     obj.status = 'Correct';
    //                     obj.privilege = AllUsers[i].level;
    //                     obj.agreement = AllUsers[i].agreement;
    //                     obj.access = true;
    //                 }
    //                 else{
    //                     obj.status = 'Correct';
    //                     obj.privilege = AllUsers[i].level;
    //                     obj.agreement = AllUsers[i].agreement;
    //                     obj.access = false;
    //                 }
    //             }
    //             else{
    //                 obj.status = 'Incorrect password';
    //                 obj.privilege = 'user';
    //                 obj.agreement = false;
    //                 obj.access = false
    //             }
    //             break
    //         }
    //     }
    //     if(flag){
    //         obj.status = 'User not found';
    //         obj.privilege = 'user';
    //         obj.agreement = false;
    //         obj.access = false;
    //     }
    //     return JSON.stringify(obj);
    // })
    // .catch(error => {
    //     console.error('Error fetching data:', error);
    // });
    //это все с данными с сервера
    const AllUsers = JSON.parse(localStorage.getItem("all-users"));
    let flag = true;
    for(let i = 0; i < AllUsers.length; ++i){
        if(AllUsers[i].login === input.login){
            flag = false;
            if(AllUsers[i].password === input.password){
                const currTime = new Date();
                if(AllUsers[i].acsess && (AllUsers[i].startDate ? new Date(AllUsers[i].startDate) <= currTime : true) && (AllUsers[i].endDate ? currTime <= new Date(AllUsers[i].endDate) : true)){
                    obj.status = 'Correct';
                    obj.privilege = AllUsers[i].level;
                    obj.agreement = AllUsers[i].agreement;
                    obj.access = true;
                }
                else{
                    obj.status = 'Correct';
                    obj.privilege = AllUsers[i].level;
                    obj.agreement = AllUsers[i].agreement;
                    obj.access = false;
                }
            }
            else{
                obj.status = 'Incorrect password';
                obj.privilege = 'user';
                obj.agreement = false;
                obj.access = false
            }
            break
        }
    }
    if(flag){
        obj.status = 'User not found';
        obj.privilege = 'user';
        obj.agreement = false;
        obj.access = false;
    }
    return JSON.stringify(obj);
    //return tempFunction(jsonstr);
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
    else if (temp.login === '111' && temp.password === '111'){
        obj.status = 'Correct';
        obj.privilege = 'superAdmin';
        obj.agreement = 'true';
        obj.access = 'true';
    }
    else if (temp.login !== '321' && temp.login !== '123' && temp.login !== '222' && temp.login !== '111'){
        obj.status = 'User not found';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'false';
    }

    else if (temp.password !== '321' && temp.password !== '123' && temp.password !== '222' && temp.password !== '111'){
        obj.status = 'Incorrect password';
        obj.privilege = 'user';
        obj.agreement = 'false';
        obj.access = 'false';
    }

    return JSON.stringify(obj);
}
