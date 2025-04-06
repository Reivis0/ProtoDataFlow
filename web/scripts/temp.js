const x = 'xее';
const y = 'yее';

console.log(x, y);

function foo(){
    console.log("afdasfa");
    return;
}

//setTimeout(()=> {console.log("adgdrr");}, 1000);

url = 'http://192.168.31.132:8080/api/auth';

jsonstr = JSON.stringify({"login": "admin", "password": "12w1e"})
console.log(jsonstr);

const answ = fetch(url, { //что тут происходит я сам не знаю
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
    console.log(data);
})
.catch(error => {
    console.error('Error fetching data:', error);
});


