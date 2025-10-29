// 1
  	window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
	// 2
	let displayTerm = "";
	
	// 3
	function searchButtonClicked(){
		console.log("searchButtonClicked() called");
		
        //#1 - giphy endpoint
        const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
        
        //#2 - api key declaration
        //PUBLIC API KEY NAHHHHHHHHHHHH
        const API_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";
        
        //#3 - get our url
        let url = GIPHY_URL + "api_key=" + API_KEY;
        

        //#4 - get what the user is asking
        let term = document.getElementById("searchterm").value;
        displayTerm = term;
        
        //#5 & #6 - trim whitespace and encode the uri
        term = encodeURIComponent(term.trim());
        
        //#7 - early return if no input
        if (term.length < 1) return;

        //#8 - append search term
        url += "&q=" + term;

        //#9 - grab the amount of images
        let limit = document.querySelector("#limit").value;
        url += "&limit=" + limit;

        //#10 - let user know the search is happening!
        document.querySelector("#status").innerHTML = `<b>Searching for '${displayTerm}'</b><img src='./images/spinner.gif'>`;

        //#11 - log the giphy url for testing purposes
        console.log(url);

        //#12 - get that data!
        getData(url);
	}

    function getData(url)
    {
        //#1 - create our xml http req
        let xhr = new XMLHttpRequest();

        //#2 & #3 - callback functions
        xhr.onload = dataLoaded;
        xhr.onerror = dataError;

        //#4 - open the url that we have gotten and send
        xhr.open("GET", url);
        xhr.send();
    }

    //CALLBACK FUNCTIONS!

    function dataLoaded(e)
    {
        //#5 & #6 - get our header from the target and log our data for debug
        let xhr = e.target;
        console.log(xhr.responseText);
        
        //#7 - parse our output and make js object literals
        let obj = JSON.parse(xhr.responseText);

        //#8 - exit early if no objects exist or fail
        if (!obj.data || obj.data.length == 0)
        {
            document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
            return;
        }

        //#9 - build our string
        let results = obj.data;
        console.log("results.length = " + results.length);
        let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

        //#10 - loop through array and append
        for (let i = 0; i < results.length; i++)
        {
            let result = results[i];

            //#11 - get the url to the gif
            let smallURL = result.images.fixed_width_small.url;
            if (!smallURL) smallURL = "./images/no-image-found.png";

            //#12 - get the url to the giphy page
            let url = result.url;

            //#13 - build a <div> to hold result
            let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
            //line += `<span>Rating: ${result.images.rating}</span>`
            line += `<span><a target='_blank' href='${url}'>View on GIPHY</a></span></div>`;
            
            //#15 (skipped 14 because no need to write all that) - append to big string
            bigString += line;
        }

        //#16 - set the inner html so that user can see content
        document.querySelector("#content").innerHTML = bigString;

        document.querySelector("#status").innerHTML = "<b>Success!</b>";


    }
    function dataError(e)
    {
        console.log("An error occured.");
    }