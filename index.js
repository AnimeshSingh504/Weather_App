const myweathertab = document.querySelector("[my-weather-tab]");
const locationweathertab = document.querySelector("[city-weather-tab]");

const locationaccess = document.querySelector("[search-tool]");
const accessbutton = document.querySelector("[grant-access-button]");

const searchingtool = document.querySelector(".search-bar");
const inputsearch = document.querySelector("[input-bar]");
const searchbutton = document.querySelector(".search-btn");

const loaderDisplay = document.querySelector("[fetching-data]");

const weatherdetails = document.querySelector(".display-weather");
const cityname = document.querySelector("[city-name]");
const countryflag = document.querySelector("[country-flag]");
const weathertype = document.querySelector("[condition-type]");
const weathertypeimage = document.querySelector("[condition-type-img]");
const tempdisplay = document.querySelector("[temp-display]");
const windspeed = document.querySelector("[windspeed-data]");
const humidity = document.querySelector("[humidity-data]");
const clouds = document.querySelector("[clouds-data]");

const displayerror = document.querySelector("[show-bad-status]");

let currentTab = myweathertab;
currentTab.classList.add("active");
let APIkey = "d70fa38d57cc80081ac49d878d3929cc";
findfromsessionstorage();

var ex;


function changetab(newtab){
    if(currentTab != newtab){
        currentTab.classList.remove("active");
        currentTab = newtab;
        currentTab.classList.add("active");

        if(!searchingtool.classList.contains("active")){
            locationaccess.classList.remove("active");
            weatherdetails.classList.remove("active");
            displayerror.classList.remove("active");
            searchingtool.classList.add("active");
        }
        else{
            searchingtool.classList.remove("active");
            displayerror.classList.remove("active");
            weatherdetails.classList.remove("active");

            findfromsessionstorage();
        }
    }
}

function findfromsessionstorage(){
    const locationcoordinates = sessionStorage.getItem("user-coordinates");
    if(!locationcoordinates){
        locationaccess.classList.add("active");
    }
    else{
        const usercoordinates = JSON.parse(locationcoordinates);
        fetchingdata(usercoordinates);
    }
}

async function fetchingdata(coordinates){
    const {lati,longi} = coordinates;

    locationaccess.classList.remove("active");
    loaderDisplay.classList.add("active");

    try{
        const coords = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${APIkey}`);
        if(coords.statusText === "Not Found"){
            throw err;
        }
        let jsoncoords = await coords.json();
        loaderDisplay.classList.remove("active");
        weatherdetails.classList.add("active");
        rendering(jsoncoords);
    }
    catch(err){
        loaderDisplay.classList.remove("active");
        displayerror.classList.add("active");
    }
}

function rendering(data)
{
    cityname.innerText = data?.name;
    countryflag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weathertype.innerText = data?.weather?.[0]?.main;
    weathertypeimage.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    tempdisplay.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    clouds.innerText = `${data?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        loaderDisplay.classList.remove("active");
        displayerror.classList.add("active");   
    }
}

function showPosition(position){
    const userCoordinates = {
        lati : position.coords.latitude,
        longi : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchingdata(userCoordinates);
}

searchbutton.addEventListener('click', (e) => {
    e.preventDefault();
    let cityname = inputsearch.value;

    if(cityname == ""){
        displayerror.classList.add("active");
    }
    else{
        getcityweather(cityname);
    }
})

async function getcityweather(city){
    locationaccess.classList.remove("active");
    weatherdetails.classList.remove("active");
    loaderDisplay.classList.add("active");

    try{
        const citydata = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
        if(citydata.statusText === "Not Found"){
            throw err;
        }
        let citydatajson = await citydata.json();
        loaderDisplay.classList.remove("active");
        weatherdetails.classList.add("active");
        inputsearch.value = "";
        rendering(citydatajson);
    }
    catch(err){
        inputsearch.value = "";
        loaderDisplay.classList.remove("active");
        displayerror.classList.add("active");
    }
}

accessbutton.addEventListener("click", getLocation);

myweathertab.addEventListener('click', () => {
    changetab(myweathertab)
});

locationweathertab.addEventListener('click', () => {
    changetab(locationweathertab)
});
































