
let temperature;
let city;
let weather_type;
let time;
let citySearch;
let citySearchList;
const WEATHER_API = "https://api.open-meteo.com/v1/forecast?";

//this is a free api with a 5000 req daily limit, please don't abuse :3
const CITY_REVERSE_API = "https://us1.locationiq.com/v1/reverse?key=pk.4d633925a4e10dc4002441f5450cb86d&format=json&";
const CITY_SEARCH_API = "https://us1.locationiq.com/v1/search?key=pk.4d633925a4e10dc4002441f5450cb86d&format=json&";

window.addEventListener("load", __init__);

//this is to ensure successful grab of data before animating the cat
let successfulQueries = false;

let temp;
let weather_code;

const LOCAL_STORAGEKEY = "WEATHER_APP_ZA_PREVIOUS_SEARCHES";
let searchData = [];


/////////////////////////////////////////////////////////////////////////////////
///                                 INITIALIZATION
/////////////////////////////////////////////////////////////////////////////////
function __init__(e)
{
    
    temperature = document.getElementById("temp");
    city = document.getElementById("city");
    weather_type = document.getElementById("weather");
    time = document.getElementById("time");
    citySearch = document.getElementById("citySearch");
    citySearchList = document.getElementById("searchList");
    
    initializeClock();

    citySearch.addEventListener("keydown", (e) =>
    {
        if (!e.repeat && e.key == "Enter")
        {
            newCityRequested();
        }
    });

    searchData = localStorage.getItem(LOCAL_STORAGEKEY) == null ? [] : JSON.parse(localStorage.getItem(LOCAL_STORAGEKEY));
    window.onbeforeunload = (e) =>
    {
        localStorage.setItem(LOCAL_STORAGEKEY, JSON.stringify(searchData));
    }


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(__successfulLocation, __errorLocation);
    } else {
        temperature.innerHTML = "Geolocation is not supported by this browser.";
    }    
}

function newCityRequested()
{
    //e.preventDefaults();
    console.log("submission works!");
    let requestedCity = citySearch.value;
    if (requestedCity.length <= 1 || !/^[A-Za-z]+/.test(requestedCity)) return;

    console.log("hello");
    let dataURL = CITY_SEARCH_API + "city=" + requestedCity;

    let xhr = new XMLHttpRequest();
    xhr.onload = cityRequestLoaded;
    xhr.onerror = cityRequestError;
    xhr.open("GET", dataURL);
    xhr.send();
}

function cityRequestLoaded(e)
{
    //console.log("success");
    let xhr = e.target;
    let json = JSON.parse(xhr.responseText);
    
    citySearchList.innerHTML = "";
    for (const e of json)
    {
        console.log(e);
        if (e.type != "hamlet") //ignoring really really tiny towns in searchs
        {

            let div = document.createElement("div");
            div.classList.add("placeButton");
            div.innerHTML = e.display_name.length > 75 ? e.display_name.substring(0, 72) + "..." : e.display_name;
            div.dataset.lat = e.lat;
            div.dataset.long = e.lon;
            div.addEventListener("click", loadCityListRequest);
            citySearchList.appendChild(div);
        }
    }

    //city.innerHTML = citySearch.value;

    //console.log(json);
    //loadWeather(json[0].lat, json[0].lon);
}

function cityRequestError(e)
{
    console.log("PROBLEM!");
}




function initializeClock()
{
    setInterval(updateClock, 1000);    
}

function updateClock()
{
    //console.log("hi");
    let t = new Date();
    let hrs = t.getHours();
    let pm = hrs > 12;
    let adjustedHours = pm ? hrs - 12 : hrs;

    //gets the last two numbers
    let hourStr = ('0' + adjustedHours.toString()).slice(-2);

    let minute = ('0' + t.getMinutes().toString()).slice(-2);

    time.innerHTML = `${hourStr}:${minute} ${pm?"PM":"AM"}`;
}

/////////////////////////////////////////////////////////////////////////////////
///                                 SUCCESSFUL LOCATION GRAB
/////////////////////////////////////////////////////////////////////////////////
function __successfulLocation(position)
{
    successfulQueries = true;
    //console.log(position);
    loadWeather(position.coords.latitude, position.coords.longitude);
    loadCity(position.coords.latitude, position.coords.longitude);

    if (successfulQueries)
    {
        animateCat(temp, weather_code);
    }
}

function loadCityListRequest(e) 
{
    //console.log(e.target.dataset.lat);
    //console.log(e.target.dataset.long);
    citySearchList.innerHTML = "";
    loadCity(e.target.dataset.lat, e.target.dataset.long);
    loadWeather(e.target.dataset.lat, e.target.dataset.long);
}

/////////////////////////////////////////////////////////////////////////////////
///                                 LOAD CITY INFORMATION
/////////////////////////////////////////////////////////////////////////////////
function loadCity(latitude, longitude)
{
    let coords = `lat=${latitude}&lon=${longitude}`;
    let dataURL = CITY_REVERSE_API + coords;

    let xhr = new XMLHttpRequest();
    xhr.onload = cityLoaded;
    xhr.onerror = cityError;
    xhr.open("GET", dataURL);
    xhr.send();
}

/////////////////////////////////////////////////////////////////////////////////
///                                 CITY LOAD SUCCESS
/////////////////////////////////////////////////////////////////////////////////
function cityLoaded(e)
{
    let xhr = e.target;

    let cityData = JSON.parse(xhr.responseText);
    console.log(cityData);
    if (cityData.address.city != undefined)
        city.innerHTML = cityData.address.city;
    else if (cityData.address.village != undefined)
        city.innerHTML = cityData.address.village;

    successfulQueries &= true;

    let c = {
        city: cityData.innerHTML,
        lat:cityData.lat,
        long:cityData.long
    };
    searchData.push(c);
}



/////////////////////////////////////////////////////////////////////////////////
///                                 GETTING THE CAT ANIMATED
/////////////////////////////////////////////////////////////////////////////////
function animateCat(temp, weather_code)
{
    let weather_category = getWeatherCategory(weather_code);
}


/////////////////////////////////////////////////////////////////////////////////
///                                 ERROR WHEN GETTING CITY
/////////////////////////////////////////////////////////////////////////////////
function cityError(e)
{
    successfulQueries = false;
    city.innerHTML = "Error!";
    temperature.innerHTML = "";
}


/////////////////////////////////////////////////////////////////////////////////
///                                 ERROR WHEN GETTING LOCATION
/////////////////////////////////////////////////////////////////////////////////
function __errorLocation(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
}

/////////////////////////////////////////////////////////////////////////////////
///                                 GET DATA FROM LATITUDE AND LONGITUDE
/////////////////////////////////////////////////////////////////////////////////
function loadWeather(latitude, longitude)
{
    let coords = `latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    let dataURL = WEATHER_API + coords;

    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;
    xhr.open("GET", dataURL);
    xhr.send();
}

/////////////////////////////////////////////////////////////////////////////////
///                                 API QUERY SUCCESS
/////////////////////////////////////////////////////////////////////////////////
function dataLoaded(e)
{
    let xhr = e.target;
    //console.log(xhr.responseText);
    //dataDump.innerHTML = xhr.responseText;
    let wData = JSON.parse(xhr.responseText);
    //console.log(wData);
    
    temp = Math.round(toFahrenheit(wData.current.temperature_2m));
    weather_code = wData.current.weather_code;
    let weatherDescription = getWeatherDescription(weather_code);

    temperature.innerText = `${temp}°F`;
    weather_type.innerHTML = weatherDescription;
    
    successfulQueries &= true;
}



/////////////////////////////////////////////////////////////////////////////////
///                                 WEATHER DESCRIPTIONS!
/////////////////////////////////////////////////////////////////////////////////

/* codes from open-meteo
Code	        Description
0	            Clear sky
1, 2, 3	        Mainly clear, partly cloudy, and overcast
45, 48	        Fog and depositing rime fog
51, 53, 55	    Drizzle: Light, moderate, and dense intensity
56, 57	        Freezing Drizzle: Light and dense intensity
61, 63, 65	    Rain: Slight, moderate and heavy intensity
66, 67	        Freezing Rain: Light and heavy intensity
71, 73, 75	    Snow fall: Slight, moderate, and heavy intensity
77	            Snow grains
80, 81, 82	    Rain showers: Slight, moderate, and violent
85, 86	        Snow showers slight and heavy
95 *	        Thunderstorm: Slight or moderate
96, 99 *	    Thunderstorm with slight and heavy hail
*/

//equivalently an enum
const WEATHER_CONDITIONS = Object.freeze(
    {
        CLEAR: 0,
        CLOUDS: 1,
        FOG: 2,
        DRIZZLE: 3,
        RAIN: 4,
        SNOW: 5,
        STORM: 6,
        THUNDER: 7
    }
)
function getWeatherCategory(weather_code)
{
    switch(weather_code)
    {
        case 0: return WEATHER_CONDITIONS.CLEAR;
        case 1: case 2: case 3: return WEATHER_CONDITIONS.CLOUDS;
        case 45: case 48: return WEATHER_CONDITIONS.FOG;
        case 51: case 53: case 55: case 57: return WEATHER_CONDITIONS.DRIZZLE;
        case 61: case 63: case 65: case 66: case 67: return WEATHER_CONDITIONS.RAIN;
        case 71: case 73: case 75: case 77: return WEATHER_CONDITIONS.SNOW;
        case 80: case 81: case 82: case 85: case 86: return WEATHER_CONDITIONS.STORM;
        case 95: case 96: case 99: return WEATHER_CONDITIONS.STORM;
        default: return WEATHER_CONDITIONS.CLEAR;
    }
}
function getWeatherDescription(weather_code)
{
    switch (weather_code)
    {
        case 0: return "Clear Sky";
        case 1: return "Mostly Clear";
        case 2: return "Partly Cloudy";
        case 3: return "Overcast";
        case 45: return "Foggy";
        case 48: return "Very Foggy";
        
        case 51:
        case 53: return "Drizzle";
        
        case 55: return "Dense Drizzle";
        
        case 56:
        case 57: return "Freezing Drizzle";
        
        case 61: 
        case 63: return "Rain";
        
        case 65: return "Heavy Rain"
        
        case 66:
        case 67: return "Freezing Rain";

        case 71: return "Light Snow";
        case 73: return "Snow";
        case 75: return "Heavy Snow";

        case 77: return "Snow Grains";

        case 80: 
        case 81: return "Rain Shower";

        case 82: return "Violent Rain Shower";

        case 85: case 86: return "Show Showers";

        case 95: return "Thunderstorm";

        case 96: case 99: return "Thunderstorm With Hail";

        default: return "NO DATA";
    }
}

//convert units to fahrenheit
function toFahrenheit(c) {return c*1.8 + 32;}

//convert units to celsius (dunno it's just here)
function toCelsius(f) {return (f - 32) / 1.8;}


/////////////////////////////////////////////////////////////////////////////////
///                                 API QUERY FAIL
/////////////////////////////////////////////////////////////////////////////////
function dataError(e)
{
    successfulQueries = false;
    temperature.innerHTML = "Error retrieving data!";
}