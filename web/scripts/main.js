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
