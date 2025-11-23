"use strict";
const app = new PIXI.Application();
let started = false;
let scenes = new Map();
let currentScene;
let stage;


window.addEventListener("load", (e) => __init__());
window.addEventListener("resize", (e) => checkProduction());

function checkProduction()
{
    if (window.innerWidth < 1280 || window.innerHeight < 720)
    {
        document.body.removeChild(app.canvas);
        app.stop();
        started = false;
    }

    if (!started)
    {
        started = true;
        app.start();
    }
}
async function __init__()
{
    await app.init({ width: 1280, height: 720});
    app.canvas.id="game";
    document.body.appendChild(app.canvas);
    checkProduction();

    if (!started) 
        return;

    stage = app.stage;
    let startScene = new Scene("start");
    scenes.set(startScene.id, startScene);
    
    currentScene = startScene;
    stage.addChild(currentScene);
}

function switchScene(id)
{
    stage.removeChild(currentScene);

    currentScene = scenes.get(id);

    if (currentScene == undefined)
    {
        console.log("Error finding " + id + " in loaded scenes. Check spelling!");
        return;
    }

    PIXI.Assets.loadBundle(id)
    stage.addChild(currentScene);
}
