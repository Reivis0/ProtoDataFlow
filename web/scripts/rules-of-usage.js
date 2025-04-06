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

const checkbox = document.getElementById("agreement-in");
const buttonNext = document.getElementById("next");
const buttonBack = document.getElementById("back");

checkbox.addEventListener("click",  () => {
    //alert(checkbox.checked);
    if(checkbox.checked) { //включать кнопку при галочке 
        buttonNext.disabled = false;
    }
    else{
        buttonNext.disabled = true;
    }
})

buttonNext.addEventListener("click", (e) => {
    let obj = new Object();
    obj.login = sessionStorage.getItem("GlobalLogin"); 
    obj.date = "";
    tempPlaceFlag(JSON.stringify(obj)); //заменить потом на postFunction
    e.preventDefault();
    //window.location.assigsn("log-in.html");
    sessionStorage.setItem("GlobalRedirect", true);
    window.location.assign("data-from-user.html");
})

buttonBack.addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

function tempPlaceFlag(message){
    //PostFunction(message);
    alert(message);
}
