const form = document.getElementById('personalDataForm');
const buttonNext = document.getElementById("next");
const buttonBack = document.getElementById("back");
const buttonUsers = document.getElementById("addUsers");

document.addEventListener("DOMContentLoaded", (e) => {  //перебрасывать в начало если нет входа
        let login = sessionStorage.getItem("GlobalLogin");
        if(login === '' || login === null) {
            e.preventDefault();
            window.location.href = "log-in.html";
        }
        else if(sessionStorage.getItem("GlobalLevel") === "admin"){
            const divSettings = document.getElementById("divSettings");
            divSettings.style.display = "block";
        }

        
})



form.addEventListener('submit', (e) => {
    let obj = new Object();
    obj.login = sessionStorage.getItem("GlobalLogin");
    obj.password = "";
    obj.name = document.getElementById("name-in").value;
    obj.surname = document.getElementById("surname-in").value;
    obj.patronymic = document.getElementById("patronymic-in").value;
    obj.agreement = 'true';
    obj.date = "";

    let jsonmessage = JSON.stringify(obj);
    sendjson(jsonmessage); //заменить потом на postFunction
    e.preventDefault();
    sessionStorage.setItem("GlobalRedirect", true);
    window.location.assign("the-table.html");

})

buttonBack.addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

buttonUsers.addEventListener("click", (e) => {
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "add-users.html";
})

function sendjson(message){
    //PostFunction(message);
    alert(message);
}