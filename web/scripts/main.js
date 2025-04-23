document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    const temp = document.getElementById('start');

    if(temp === null){
        let login = sessionStorage.getItem("GlobalLogin");
        if(login === '' || login === null) {
            e.preventDefault();
            window.location.href = "log-in.html";
     }
     else{
        sessionStorage.setItem('GlobalUrl', "http://127.0.0.1:8080");
        
     }
    }
})



async function PostFunction(message) {
    //alert(message);
    //console.log("ddddd"); //это вывод в консоль браузера, не стреды разработки

    url = sessionStorage.getItem("GlobalUrl");


    fetch(url,  
        {
            method: 'POST',
            body: message,
            headers: {
                'Content-Type': 'application/json',
              }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        }
    )
        .catch(error => console.log(error))
}

async function GetFunction() {
    url = sessionStorage.getItem("GlobalUrl");
    const answ = fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    return answ;

}




let messageForIdentification = {login: login, model: "model", variant: "var"}; //это чтобы получать данные
fetch('http://127.0.0.1:8080/api/auth', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageForIdentification),
  }

)
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); 
})
.then(serverData => {
    console.log(data); //!!!!!!!!!!!!!!!!!!!тут что ты делаешь с данными с сервера!!!!!!!!!!!!!!!!!!!!!
})
.catch(error => {
    console.error('Error fetching data:', error);
});





fetch('http://127.0.0.1:8080/api/auth', { //это чтобы отправлять сохраненные даные
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({information:"asda", data:message}),
  }
  )
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); 
  })
  .then(answer => {
      console.log(answer);
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });
