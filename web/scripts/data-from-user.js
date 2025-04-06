//document.addEventListener("readystatechange", (e) => {
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

const form = document.getElementById('personalDataForm');
const buttonNext = document.getElementById("next");
const buttonBack = document.getElementById("back");

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
    /*
    let obj = new Object();
    obj.login = sessionStorage.getItem("GlobalLogin");
    obj.password = "";
    obj.name = document.getElementById("name-in").value;
    obj.surname = document.getElementById("surname-in").value;
    obj.patronymic = document.getElementById("patronymic-in").value;
    obj.date = "";

    let jsonmessage = JSON.stringify(obj);
    sendjson(jsonmessage)
    */
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

function sendjson(message){
    //PostFunction(message);
    alert(message);
}