/*

document.addEventListener("DOMContentLoaded", (e) => {
    let login = sessionStorage.getItem("GlobalLogin");
    if(login === '' || login === null) {
        e.preventDefault();
        //window.location.assigsn("log-in.html");
        window.location.href = "log-in.html";
    }
})
*/

const checkbox1 = document.getElementById("agreement-in");
const checkbox2 = document.getElementById("personal-data-in");
const buttonNext = document.getElementById("next");
const buttonBack = document.getElementById("back");
const form = document.getElementById("personalDataForm")

checkbox1.addEventListener("click",  () => {
    //alert(checkbox.checked);
    if(checkbox1.checked && checkbox2.checked) { //включать кнопку при галочке 
        buttonNext.disabled = false;
    }
    else{
        buttonNext.disabled = true;
    }
})

checkbox2.addEventListener("click",  () => {
    //alert(checkbox.checked);
    if(checkbox1.checked && checkbox2.checked) { //включать кнопку при галочке 
        buttonNext.disabled = false;
    }
    else{
        buttonNext.disabled = true;
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let obj = new Object();
    obj.login = sessionStorage.getItem("GlobalLogin"); 
    obj.name = document.getElementById("name-in").value;
    obj.surname = document.getElementById("surname-in").value;
    obj.patronymic = document.getElementById("patronymic-in").value;
    tempPlaceFlag(JSON.stringify(obj)); 

    fetch('http://127.0.0.1:8080/api/auth', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }
    
    )
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    
    //window.location.assigsn("log-in.html");
    window.location.assign("data-from-user.html");

})
/*
buttonNext.addEventListener("click", (e) => {
    let obj = new Object();
    obj.login = sessionStorage.getItem("GlobalLogin"); 
    obj.date = "";
    tempPlaceFlag(JSON.stringify(obj)); //заменить потом на postFunction
    e.preventDefault();
    //window.location.assigsn("log-in.html");
    window.location.assign("data-from-user.html");
})
*/

buttonBack.addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

function tempPlaceFlag(message){
    alert(message);
}
