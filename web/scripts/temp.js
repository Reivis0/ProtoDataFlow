jsonstr = JSON.stringify({"login": "admin", "password": "12w1e"})
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

    let answer = data;
    console.log(JSON.stringify(data));
    console.log(data.status);
   // for(let i =0; i< 100000; i++)
    //{
      //  if(i<3) alert('23456');
    //}
    if(data.status === 'Correct') { //если все хорошо
        sessionStorage.setItem('GlobalLogin', login.value);
        sessionStorage.setItem('GlobalLevel', data.privilege);
        //sessionStorage.setItem("GlobalRedirect", true);
        e.preventDefault();  
        if(data.access === 'true'){  
            if(data.agreement === 'false') {
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
        console.log('6789');
        error_div.innerText = "Неправильный логин";
        e.preventDefault();
    }
    else if (data.status === 'Incorrect password'){
        error_div.innerText = "Неправильный пароль";
        e.preventDefault();
    }
    else {console.log(data.status === 'User not found')};
    console.log(data.status === 'User not found1');


})
.catch(error => {
    console.error('Error fetching data:', error);
});