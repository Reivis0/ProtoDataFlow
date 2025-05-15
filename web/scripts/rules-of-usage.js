
let GlobalLogin;
document.addEventListener("DOMContentLoaded", (e) => {
    let login = sessionStorage.getItem("GlobalLogin");
    if(login === '' || login === null) {
        e.preventDefault();
        //window.location.assigsn("log-in.html");
        window.location.href = "log-in.html";
    }
    GlobalLogin = login;
})

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
    tempPlaceFlag(obj); 

    window.location.assign("information-about-model.html");

})


buttonBack.addEventListener("click", (e) => {
    sessionStorage.clear();
    e.preventDefault();
    //window.location.assigsn("log-in.html");
     window.location.href = "log-in.html";
})

function tempPlaceFlag(obj){

    fetch(ServerAdress + `/users/${GlobalLogin}/agree`, {
        method: 'POST'
        }
    )
    console.log(`http://localhost:3000/${GlobalLogin}/agree`);
    const AllUsers = JSON.parse(localStorage.getItem("all-users"));
     for(let i = 0; i < AllUsers.length; ++i){
        if(AllUsers[i].login === GlobalLogin){
            AllUsers[i].agreement = true;
            break;
        }
     }
     localStorage.setItem("all-users", JSON.stringify(AllUsers));
     //console.log(JSON.parse(localStorage.getItem("all-users")));
}
