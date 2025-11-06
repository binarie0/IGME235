//this is for the form
let weatherData;
let city;
const WEATHER_API = "https://api.open-meteo.com/v1/forecast?";

//this is a free api with a 5000 req daily limit, please don't abuse :3
const CITY_API = "https://us1.locationiq.com/v1/reverse?key=pk.4d633925a4e10dc4002441f5450cb86d&format=json&"

window.addEventListener("load", __init__);


/////////////////////////////////////////////////////////////////////////////////
///                                 INITIALIZATION
/////////////////////////////////////////////////////////////////////////////////
function __init__(e)
{
    weatherData = document.getElementById("weather");
    city = document.getElementById("city");

    //request user location
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(__successfulLocation, __errorLocation);
    } else {
        weatherData.innerHTML = "Geolocation is not supported by this browser.";
    }
}

/////////////////////////////////////////////////////////////////////////////////
///                                 SUCCESSFUL LOCATION GRAB
/////////////////////////////////////////////////////////////////////////////////
function __successfulLocation(position)
{
    //console.log(position);
    loadWeather(position.coords.latitude, position.coords.longitude);
    loadCity(position.coords.latitude, position.coords.longitude);
}

/////////////////////////////////////////////////////////////////////////////////
///                                 LOAD CITY INFORMATION
/////////////////////////////////////////////////////////////////////////////////
function loadCity(latitude, longitude)
{
    let coords = `lat=${latitude}&lon=${longitude}`;
    let dataURL = CITY_API + coords;

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
    //console.log(cityData);

    city.innerHTML = cityData.address.city;


}


/////////////////////////////////////////////////////////////////////////////////
///                                 ERROR WHEN GETTING CITY
/////////////////////////////////////////////////////////////////////////////////
function cityError(e)
{
    city.innerHTML = "Error!";
    weatherData.innerHTML = "";
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
    
    let temp = Math.round(toFahrenheit(wData.current.temperature_2m));
    let weatherDescription = getWeatherDescription(wData.current.weather_code);
    let dataString = `Temperature: ${temp}°F\n${weatherDescription}`;

    weatherData.innerText = dataString;
    
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

        case 71: return "Light Snowfall";
        case 73: return "Snowfall";
        case 75: return "Heavy Snowfall";

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
    weatherData.innerHTML = "Error retrieving data!";
}