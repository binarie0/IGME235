"use strict";
//const {SceneManager} = require("./SceneManager");
//const {Scene} = require("./Scene");

const app = new PIXI.Application();
let started = false;
let scenes;
let currentScene;
let stage;

///




window.addEventListener("load", (e) => __init__());
//window.addEventListener("resize", (e) => checkProduction());

function checkProduction()
{

    //close window if we don't like the sizing of the document
    if (window.innerWidth < 1280 || window.innerHeight < 720)
    {
        document.body.removeChild(app.canvas);
        app.stop();
        started = false;
    }

    //ensure start only occurs if the document hasnt been started already
    if (!started)
    {
        started = true;
        app.start();
    }
}

//start game logic
async function __init__()
{
    
    //create app
    await app.init({ width: 1280, height: 720});
    app.canvas.id="game";
    document.body.appendChild(app.canvas);
    
    //ensure window can handle doc, and if it cant exit
    checkProduction();
    if (!started) 
        return;

    //grab stage
    stage = app.stage;
    scenes = new SceneManager(stage);



    //scene 1 - start scene
    let startScene = scenes.createNewScene("start");
    startScene.update = (time) =>
    {
        console.log(`FPS: ${(1 / time).toFixed(0)}`);
    };
    
    
    
    
    
    
    //this must be awaited because sometimes the ticker starts before start scene has been set
    await scenes.setScene(startScene.id);

    app.ticker.add(gameLoop);



    let intCallback = new Listener(12);
    intCallback.addCallback((val) => console.log(`This is callback 1 with value ${val}`));
    intCallback.addCallback((val) => console.log(`This is callback 2: ${val}^2 = ${val*val}.`));
    intCallback.setValue(2);
}
function gameLoop()
{
    let dt = 1 / app.ticker.FPS;
    //clamp to 1/12 as max
    dt = clamp(dt, 0, 0.083333);
    scenes.currentScene.update(dt);
}

async function switchScene(id)
{
    currentScene = await scenes.setScene(id);

    if (currentScene == undefined)
    {
        console.log("Error finding " + id + " in loaded scenes. Check spelling!");
    }
}
