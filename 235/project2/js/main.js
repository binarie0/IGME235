let latitude;
let longitude;
let form;
let dataDump;

const WEATHER_API = "https://api.open-meteo.com/v1/forecast?";

/*
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


window.onload = __init__;


function __init__(e)
{
    console.log("initialization called");
    latitude = document.getElementById("latitude");
    longitude = document.getElementById("longitude");
    form = document.getElementById("form");
    dataDump = document.getElementById("dataDump");

    form.addEventListener("submit", onSubmit);
}


function onSubmit(e)
{
    e.preventDefault();
    console.log("Submission logged");
    if (!latitude.value) latitude.value = 0.0;
    if (!longitude.value) longitude.value = 0.0;
    let coords = `latitude=${latitude.value}&longitude=${longitude.value}&current=temperature_2m,weather_code`;

    let dataURL = WEATHER_API + coords;

    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;
    xhr.open("GET", dataURL);
    xhr.send();
}

function dataLoaded(e)
{
    let xhr = e.target;
    console.log(xhr.responseText);
    dataDump.innerHTML = xhr.responseText;
}

function dataError(e)
{
    dataDump.innerHTML = "Error retrieving data!";
}