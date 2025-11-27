"use strict";
//const {SceneManager} = require("./SceneManager");
//const {Scene} = require("./Scene");
const WIDTH = 1280;
const HEIGHT = 720;
const app = new PIXI.Application();
let started = false;
let scenes;
let currentScene;
let stage;

let fontsLoaded = false;
window.addEventListener("load", (e) => __init__());
//window.addEventListener("resize", (e) => checkProduction());

function checkProduction()
{

    //close window if we don't like the sizing of the document
    if (window.innerWidth < WIDTH || window.innerHeight < HEIGHT)
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
    WebFont.load({
        custom: {
            families: ["SuperAdorable"],
            urls: ["/css/fonts.css"]
        },
        active: () => 
            {
                __startApp();
            }

    })
    
}
async function __startApp()
{
    //create app
    await app.init({ width: WIDTH, height: HEIGHT});
    console.log("App loaded!");


    let canvas = app.canvas;
    canvas.id = "game";
    document.body.appendChild(canvas);


    //ensure window can handle doc, and if it cant exit
    checkProduction();
    if (!started) 
        return;

    //grab stage
    stage = app.stage;
    scenes = new SceneManager(stage);


    let lightGreen = 0x1aff1a;
    //all required label and buttons
    let titleLabelStyle = 
    {
        fill: lightGreen,
        fontSize: 256,
        fontFamily: "SuperAdorable",
        stroke: 0x000000,
        strokeThickness: 5
    }

    let stdButtonStyle = 
    {
        fill: 0xffffff,
        fontSize: 100,
        fontFamily: "SuperAdorable",
        stroke: 0x000000,
        strokeThickness: 2.5
    }

    let stdLabelStyle =
    {
        fill: lightGreen,
        fontSize: 32,
        fontFamily: "SuperAdorable",
        stroke: 0x000000,
        strokeThickness: 1
    }





    //scene 1 - start scene
    let startScene = scenes.createNewScene("start");

    let title = new PIXI.Text("Ribbit!", titleLabelStyle);
    centerElementX(title, WIDTH);
    title.y = 20;
    startScene.addChild(title);

    let startButton = new PIXI.Text("Start Game!", stdButtonStyle);
    centerElementX(startButton, WIDTH);
    centerElementY(startButton, HEIGHT);
    startButton.interactive = true;
    startButton.buttonMode = true;
    defaultButtonLogic(startButton, lightGreen, stdButtonStyle.fill, (e) => scenes.setScene("game"));

    let optionsMenu = new PIXI.Text("Options", stdButtonStyle);
    centerElementX(optionsMenu, WIDTH);
    optionsMenu.y = 400;
    optionsMenu.interactive = true;
    optionsMenu.buttonMode = true;
    defaultButtonLogic(optionsMenu, lightGreen, stdButtonStyle.fill, (e) => scenes.setScene("options"));

    startScene.addChild(startButton);
    startScene.addChild(optionsMenu);
    
    
    //scene 2 - game scene
    let gameScene = scenes.createNewScene("game");

    let player = new Player();
    player.ChargeTime.addCallback((time) => {
        console.log(`Charge Time: ${time}`);
    })
    gameScene.addChild(player);

    gameScene.start = () =>
    {
        player.resetState();
    };

    gameScene.update = (dt) => {
        player.update(dt);
    };

    gameScene.onKeyboardDownEvent = (e) =>
    {
        console.log(e);
        if (!e.repeat && e.code == "Space")
            player.onStartJump();
    }
    gameScene.onKeyboardUpEvent = (e) =>
    {
        console.log(e);
        if (e.code == "Space")
            player.onJump();
    }
    gameScene.onMouseMoveEvent = (e) =>
    {
        if (player.PlayerState.getValue() != player.PLAYER_STATE.CHARGING)
            return;

    }



    //WINDOW FUNCTIONS TO PASS DOWN TO CHILD SCENES!
    window.addEventListener("keydown", (e) =>
    {
        scenes.currentScene.onKeyboardDownEvent(e);
    });
    window.addEventListener("keyup", (e) => 
    {
        scenes.currentScene.onKeyboardUpEvent(e);
    });
    //set on canvas to ensure a player does not trigger when out of game bounds.
    canvas.addEventListener("mousemove", (e) =>
    {
        scenes.currentScene.onMouseMoveEvent(e);
    });
    
    //this must be awaited because sometimes the ticker starts before start scene has been set, breaking the chain
    await scenes.setScene(startScene.id);
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
    await scenes.setScene(id);

    if (scenes.currentScene == undefined)
    {
        console.log("Error finding " + id + " in loaded scenes. Check spelling!");
    }
}
