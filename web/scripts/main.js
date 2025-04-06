document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
    const temp = document.getElementById('start');
    //let num = localStorage.getItem("GlobalNum");
    //localStorage.setItem("GlobalNum", num + 1)
    //localStorage.setItem("GlobalRedirect", false);
    if(temp === null){
        let login = sessionStorage.getItem("GlobalLogin");
        if(login === '' || login === null) {
            e.preventDefault();
        //window.location.assigsn("log-in.html");
            window.location.href = "log-in.html";
     }
     else{
        sessionStorage.setItem('GlobalUrl', "свой адрес");
       // localStorage.setItem('GlobalUrl', "свой адрес");  //
        //localStorage.setItem("GlobalNum", 1)
     }
    }
})

/*
window.addEventListener("beforeunload", (event) => {
    alert("gggg");
    event.preventDefault();
    let num = localStorage.getItem("GlobalNum");
    let flag = localStorage.getItem("GlobalRedirect");
    num -= 1;
    localStorage.setItem("GlobalNum", num);
    alert(num, flag);
    if(!flag && num === 0) {
        localStorage.clear();
    }
});
*/

//учимся делать коммиты 4

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
