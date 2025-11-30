"use strict";
//const {SceneManager} = require("./SceneManager");
//const {Scene} = require("./Scene");
const WIDTH = 1280;
const HEIGHT = 720;

const TILE_SIZE = 32;

const FPS_LS_KEY = "ZDA9250_PROJECT3_PREFERENCES";

const app = new PIXI.Application();
let started = false;
let scenes;
let currentScene;
let stage;

let fontsLoaded = false;
let showFPS = false;
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

    window.onbeforeunload = (e) =>
    {
        scenes.free();
        localStorage.setItem(FPS_LS_KEY, JSON.stringify(showFPS));   
    }

    let fps_pot = localStorage.getItem(FPS_LS_KEY);
    if (fps_pot != undefined)
    {
        showFPS = JSON.parse(fps_pot);
    }


    let lightGreen = 0x1aff1a;
    let lightRed = 0xff1a1a;
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

    let toggleButtonStyle = 
    {
        fill: lightRed,
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





    //#region START SCENE
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
    optionsMenu.y = 420;
    optionsMenu.interactive = true;
    optionsMenu.buttonMode = true;
    defaultButtonLogic(optionsMenu, lightGreen, stdButtonStyle.fill, (e) => scenes.setScene("options"));

    let credits = new PIXI.Text("Credits", stdButtonStyle);
    centerElementX(credits, WIDTH);
    credits.y = 540;
    credits.interactive = true;
    credits.buttonMode = true;
    defaultButtonLogic(credits, lightGreen, stdButtonStyle.fill, (e) => scenes.setScene("credits"));

    startScene.addChild(startButton);
    startScene.addChild(optionsMenu);
    startScene.addChild(credits);

    //#endregion
    
    //#region OPTIONS SCENE
    let optionsScene = scenes.createNewScene("options");

    title = new PIXI.Text("Options", titleLabelStyle);
    centerElementX(title, WIDTH);
    title.y = 20;
    
    let fpsButton = new PIXI.Text("Show FPS", toggleButtonStyle);
    centerElementX(fpsButton, WIDTH);
    fpsButton.y = 300;
    fpsButton.interactive = true;
    fpsButton.buttonMode = true;

    //have to do custom logic since the color technically changes
    fpsButton.on("pointerover", (e) => e.target.style.fill = 0xaaaaaa);
    fpsButton.on("pointerout", (e) =>  e.target.style.fill = showFPS ? lightGreen:lightRed);
    fpsButton.on("pointerup", (e) => 
        {
            showFPS = !showFPS;
            e.target.style.fill = showFPS ? lightGreen:lightRed
        }
    );
    
    
    
    let backButton = new PIXI.Text("Go Back", stdButtonStyle);
    centerElementX(backButton, WIDTH);
    backButton.y = 600;
    backButton.interactive = true;
    backButton.buttonMode = true;
    defaultButtonLogic(backButton, lightGreen, stdButtonStyle.fill, (e) => scenes.setScene("start"));

    optionsScene.addChild(title);
    optionsScene.addChild(fpsButton);
    optionsScene.addChild(backButton);
    //TODO: IN GAME SCENE CONNECT THESE TWO TOGETHER

    //#endregion

    //#region CREDITS SCENE

    let creditsScene = scenes.createNewScene("credits");

    title = new PIXI.Text("Credits", titleLabelStyle);
    centerElementX(title, WIDTH);
    title.y = 20;

    let creds = new PIXI.Text("A project by Zach Ayers", stdLabelStyle);
    centerElementX(creds, WIDTH);
    creds.y = HEIGHT/2 - 30;
    
    let otherCreds = new PIXI.Text("Made for IGME 235 | Intro to Game Web Tech", stdLabelStyle);
    centerElementX(otherCreds, WIDTH);
    otherCreds.y = HEIGHT/2 + 30;

    backButton = new PIXI.Text("Go Back", stdButtonStyle);
    centerElementX(backButton, WIDTH);
    backButton.y = 600;
    backButton.interactive = true;
    backButton.buttonMode = true;
    defaultButtonLogic(backButton, lightGreen, stdButtonStyle.fill, (e) => scenes.setScene("start"));
    



    creditsScene.addChild(title);
    creditsScene.addChild(creds);
    creditsScene.addChild(otherCreds);
    creditsScene.addChild(backButton);
    //#endregion



    //scene 2 - game scene
    let gameScene = scenes.createNewScene("game");

    let fpsListener = new Listener(0);
    fpsListener.addCallback((frames) => fps.text = `${frames} FPS`);
    let fps = new PIXI.Text("", stdLabelStyle);
    fps.x = 10;
    fps.y = 10;
    
    let player = new Player(TILE_SIZE, TILE_SIZE);
    player.ChargeTime.addCallback((time) => {
        console.log(`Charge Time: ${time}`);
    })
    gameScene.addChild(fps);
    gameScene.addChild(player);

    gameScene.start = () =>
    {
        player.resetState();
        //update on start because why not
        fps.visible = showFPS;
    };
    gameScene.update = (dt) => {
        player.update(dt);
        //update fps counter if needed
        if (showFPS)
            fpsListener.setValue(app.ticker.FPS.toFixed(0));
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

    app.ticker.add(gameLoop);
}
function gameLoop()
{
    let dt = 1 / app.ticker.FPS;
    //clamp to 1/12 as max
    dt = clamp(dt, 0, 0.083333);
    scenes.update(dt);
}

async function switchScene(id)
{
    await scenes.setScene(id);

    if (scenes.currentScene == undefined)
    {
        console.log("Error finding " + id + " in loaded scenes. Check spelling!");
    }
}
