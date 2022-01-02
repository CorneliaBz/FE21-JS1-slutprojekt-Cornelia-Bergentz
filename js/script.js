//weatherbit api key
const key = `6ad07091c8f244878e56a9ef4f69f50f`;

//User input variabler
const btn = document.querySelector(`button`);
const city = document.querySelector(`input`); 

//anime js
const divAnime = document.querySelectorAll(`div`);

//animation på header - anime js
anime({
    targets: `.headerIMG`,
    duration: 2000,
    easing: 'linear',
    rotateY: 360,
});

anime({
    targets: `.headerText`,
    opacity: [0, 1],
    delay: 1500,
    duration: 1000,
    easing: 'linear',
});

//Knappen för söka stad 
btn.addEventListener(`click`, function(event){

    event.preventDefault();

    setMessage(''); //tar bort error meddelandet

    //Skickar searchvalue till function 
    searchToday(city.value);
    searchWeek(city.value);

    const div = document.getElementById(`fivedays`);
    const divAll = document.querySelectorAll('div *');

    //Tar bort tidigare sökning
    for(let i = 0; i<divAll.length; i++){
        const all = divAll[i];
        all.remove();
    }
    
    //Fade in divs animation - anime js
    anime({
        targets: divAnime,
        opacity: [0, 1],
        delay: 700,
        duration: 1000,
        easing: 'linear',
      });
}
);

//En funktion som kallar på weatherbits "current" api och hämtar nuvarande väder-info.

function searchToday(city){
    const urlToday = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${key}&lang=sv`

    fetch(urlToday).then( function(response){
            if(response.status >= 0 && response.status <300) {
                return response.json();
            }else {
                throw "Something went wrong";
            }          
        }
    ).then(
        function(data){

            //Skapar nya elements i div id=today - Endast för dagens datum. 
            for(let i=0; i<1; i++){

                //hämtar todayDiv
                const todayDiv = document.getElementById(`today`);
                //skapar p element med Texten "IDAG"
                const pidag = document.createElement(`p`);
                pidag.innerText = `IDAG`;
                //skapar img och hämtar bild baserat på infon weather.icon
                const img = document.createElement(`img`);
                img.src = `https://corneliabz.github.io/bildbas/WeatherIcons/` + data.data[0].weather.icon +`.png`;
                
                //Bakgrunden på todayDiv anpassas efter infon weather.icon
                let imgcode = data.data[0].weather.icon +`.png`
                todayDiv.style.backgroundImage = `url('img/Backgrounds/bg${imgcode}')`;
                //skapar h2 element som visar stad och country_code
                const h2Date = document.createElement(`h2`);
                h2Date.innerText = data.data[0].city_name + `, ` + data.data[0].country_code;
                //skapar h3 med beskriving på vädret
                const h3Description = document.createElement(`h3`);
                h3Description.innerText = data.data[0].weather.description;
                //skapar p element med temperatur och en class.
                const pTemp = document.createElement(`p`);
                pTemp.innerText = data.data[0].temp + `°C`;
                pTemp.classList.add("styleTemp");
                //skapar h3 element med vindhastighet och luftfuktighet
                const h3info= document.createElement(`h3`);
                h3info.innerText =  data.data[0].wind_spd + ` m/s` + ` | ` + data.data[0].rh + `% RF`;
                
                //den hämtade informationen blir children till todayDiv för att placeras ut rätt i DOM:en
                todayDiv.appendChild(pidag);
                todayDiv.appendChild(h2Date);
                todayDiv.appendChild(img);
                todayDiv.appendChild(pTemp);
                todayDiv.appendChild(h3Description);
                todayDiv.appendChild(h3info);
            }
        }
    ).catch(function (error) {
        console.log(error);
        setMessage(`"${city}" hittas ej, definiera din sökning genom att lägga till land!`); //Vad som än går fel visas detta meddelande för användare
      }); 
}
//En till funktion som hämtar information från weatherbits "daily" api. - Hämtar resterande dagar.
function searchWeek(city){
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}&lang=sv`;

    fetch(url).then( function(response){
            if(response.status >= 0 && response.status <300) {
                return response.json();
            }else {
                throw "Something went wrong";
            }
            
        }
    ).then(
        function(data){
            //Skapar nya elements i div id=fiveDays - väder för 5 dagar framåt
            for(let i=1; i<=5; i++){ 
                //hämtar fiveDays    
                const fiveDays = document.getElementById(`fiveDays`);
                //skapar en ny div - newDiv
                const newDiv = document.createElement(`div`);
                //skapar img och hämtar bild baserat på infon weather.icon + lägger till classen allFiveDays
                const img = document.createElement(`img`);
                img.src = `https://corneliabz.github.io/bildbas/WeatherIcons/` + data.data[i].weather.icon +`.png`;
                img.classList.add("allFiveDays"); 
                //skapar h4 med datum och lägger till classen allFiveDays
                const h4Date = document.createElement(`h4`);
                h4Date.innerText = data.data[i].datetime;
                h4Date.classList.add("allFiveDays"); 
                //skapar p element med beskrivning av vädret lägger till classen allFiveDays
                const pDescription = document.createElement(`p`);
                pDescription.innerText = data.data[i].weather.description;
                pDescription.classList.add("allFiveDays"); 
                //skapar p element som visar temperaturen och lägger till classen allFiveDays
                const pTemp = document.createElement(`p`);
                pTemp.innerText = data.data[i].temp + `°C`;   
                pTemp.classList.add("allFiveDays");  
                //den hämtade informationen blir children till fiveDays och newDiv för att placeras ut rätt i DOM:en
                //FiveDays består alltså av 5 divs (newDiv) som alla innehåller den hämtade informationen för respektive dag.
                fiveDays.appendChild(newDiv);
                newDiv.appendChild(h4Date);
                newDiv.appendChild(pDescription);
                newDiv.appendChild(pTemp);
                newDiv.appendChild(img);

            }
        }
    ).catch(function (error) {
        console.log(error);
        setMessage(`"${city}" hittas ej, definiera din sökning genom att lägga till land!`); //Vad som än går fel visas detta meddelande för användare
      }); 
}

//setMeddelande till användaren
function setMessage(message) {
    const h2 = document.querySelector("#message");
    h2.innerText = message;
  
    if(message === ''){
      h2.style.display = "none";
    }
    else{
      h2.style.display = "block";
    }
}