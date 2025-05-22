function IsComplianceEnabled(){
    let forMatricies = JSON.parse(sessionStorage.getItem("for-matricies"));
    let goodViews = 0;
    let objs = Array.from(Object.keys(forMatricies));
    for(let i = 0; i < objs.length; ++i){
        let views = Array.from(Object.keys(forMatricies[objs[i]]["views"]));
        for(let j = 0; j < views.length; ++j){
            let comps = Array.from(Object.keys(forMatricies[objs[i]]["views"][views[j]]));
            //let goodComps = 0;
            for(let k = 0; k < comps.length; ++k){
                if(forMatricies[objs[i]]["views"][views[j]][comps[k]].length > 0){
                    ++goodViews;
                    break
                }
            }
            if(goodViews > 1){break;}
        }
        if(goodViews > 1){break;}
    }
    return (goodViews > 1);
}

function IsTraceabilityEnabled(){
    let forMatricies = JSON.parse(sessionStorage.getItem("for-matricies"));
    let objs = Array.from(Object.keys(forMatricies));
    for(let i = 0; i < objs.length; ++i){
        if(forMatricies[objs[i]]["specific-requrements"].length){
            let views = Array.from(Object.keys(forMatricies[objs[i]]["views"]));
            for(let j = 0; j < views.length; ++j){
                let comps = Array.from(Object.keys(forMatricies[objs[i]]["views"][views[j]]));
                for(let k = 0; k < comps.length; ++k){
                    if(forMatricies[objs[i]]["views"][views[j]][comps[k]].length > 0){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function createComplianceButtons(currentPage){
    let div = document.getElementById("matrixCompliance");
    div.querySelectorAll('button:not(:first-child)').forEach(button =>  button.remove() );
    let complianceData = JSON.parse(sessionStorage.getItem("compliance-matricies-data"));
    let names = Array.from(Object.keys(complianceData));
    names.forEach(name => {
        const button = document.createElement("button");
        button.className = "dropUpBtn";
        button.textContent = name;
        button.addEventListener("click", (e) => {
            //sessionStorage.setItem("previousName", name);
            const tempStruct = JSON.parse(sessionStorage.getItem("matrix-navigation"));
            let tempFlag = true;
            if(tempStruct && tempStruct.flag){
                tempFlag = false;
            }
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page: tempFlag ? currentPage : tempStruct.page, name: name, flag: true}));
            window.location.href = "compliance-matrix.html";
        });
        div.appendChild(button);
    });
    div.children[0].addEventListener("click", (e) => {
        const tempStruct = JSON.parse(sessionStorage.getItem("matrix-navigation"));
        let tempFlag = true;
        if(tempStruct && tempStruct.flag){
            tempFlag = false;
        }
        sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page:  tempFlag ? currentPage : tempStruct.page, name: null, flag: true}));
        window.location.href = "compliance-matrix.html";
    });
}


function createTraceabilityButtons(currentPage){
    let div = document.getElementById("matrixVerification");
    div.querySelectorAll('button:not(:first-child)').forEach(button =>  button.remove() );
    let traceabilityData = JSON.parse(sessionStorage.getItem("traceability-matricies-data"));
    let names = Array.from(Object.keys(traceabilityData));
    names.forEach(name => {
        const button = document.createElement("button");
        button.className = "dropUpBtn";
        button.textContent = name;
        button.addEventListener("click", (e) => {
            const tempStruct = JSON.parse(sessionStorage.getItem("matrix-navigation"));
            let tempFlag = true;
            if(tempStruct && tempStruct.flag){
                tempFlag = false;
            }
            sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page: tempFlag ? currentPage : tempStruct.page, name: name, flag: true}));
            window.location.href = "traceability-matrix.html";
        });
        div.appendChild(button);
    });
    div.children[0].addEventListener("click", (e) => {
        //sessionStorage.setItem("previousName", matrixName);
        const tempStruct = JSON.parse(sessionStorage.getItem("matrix-navigation"));
        let tempFlag = true;
        if(tempStruct && tempStruct.flag){
            tempFlag = false;
        }
        sessionStorage.setItem("matrix-navigation", JSON.stringify({count: 0, page: tempFlag ? currentPage : tempStruct.page, name: null, flag: true}));
        window.location.href = "traceability-matrix.html";
    });
}

function toServerSave(){
    const login = sessionStorage.getItem("GlobalLogin");
    const userData = JSON.parse(localStorage.getItem(`data-model`));
    const curModel = sessionStorage.getItem("currentModel");
    fetch(ServerAdress + `/data/${login}/${curModel}`, { 
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        //body: JSON.stringify(userData),
        body: JSON.stringify({model: userData}),
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
}

function setupHeaderButtons() {
    document.getElementById("What2do").addEventListener("click", () => {
        showToast("Раздел помощи будет реализован позже", "info");
    });
    
    document.getElementById("How2do").addEventListener("click", () => {
        showToast("Раздел помощи будет реализован позже", "info");
    });
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.style.bottom = '75px';
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

let ServerAdress = "http://localhost:3000";


