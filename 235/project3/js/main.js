"use strict";
const WIDTH = 1024;
const HEIGHT = 768;

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

    //#region BUNDLES
    PIXI.Assets.addBundle("game",
        {
            b1: "media/building1.png",
            b2: "media/building2.png",
            bg: "media/bg.png",
            bg2: "media/bg2.png",
            player: 'media/player.png',
            cursor: 'media/cursor.png'
        }
    )
    //#endregion

    //#region DEFAULT STARTUP LOGIC FOR GAME
    let canvas = app.canvas;
    canvas.id = "game";
    document.body.appendChild(canvas);

    app.renderer.background.color = 0x005217;
    


    //ensure window can handle doc, and if it cant exit
    checkProduction();
    if (!started) 
        return;

    let jumpSound = new Howl({
        src: ["media/jump.ogg"],
    });




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

    //#endregion 


    let lightGreen = 0x1aff1a;
    let lightRed = 0xff1a1a;
    //all required label and buttons
    let titleLabelStyle = 
    {
        fill: lightGreen,
        fontSize: 230,
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
        fontSize: 50,
        fontFamily: "SuperAdorable",
        stroke: 0x000000,
        strokeThickness: 2
    }





    //#region START SCENE
    let startScene = scenes.createNewScene("start");

    let title = new PIXI.Text("Ribbit!", titleLabelStyle);
    centerElementX(title);
    title.y = 20;
    startScene.addChild(title);

    let startButton = new PIXI.Text("Start Game!", stdButtonStyle);
    centerElementX(startButton);
    centerElementY(startButton);
    startButton.interactive = true;
    startButton.buttonMode = true;
    defaultButtonLogic(startButton, lightGreen, stdButtonStyle.fill, (e) => switchScene("game"));

    let optionsMenu = new PIXI.Text("Options", stdButtonStyle);
    centerElementX(optionsMenu);
    optionsMenu.y = 420;
    optionsMenu.interactive = true;
    optionsMenu.buttonMode = true;
    defaultButtonLogic(optionsMenu, lightGreen, stdButtonStyle.fill, (e) => switchScene("options"));

    let credits = new PIXI.Text("Credits", stdButtonStyle);
    centerElementX(credits);
    credits.y = 540;
    credits.interactive = true;
    credits.buttonMode = true;
    defaultButtonLogic(credits, lightGreen, stdButtonStyle.fill, (e) => switchScene("credits"));

    startScene.addChild(startButton);
    startScene.addChild(optionsMenu);
    startScene.addChild(credits);

    //#endregion
    
    //#region OPTIONS SCENE
    let optionsScene = scenes.createNewScene("options");

    title = new PIXI.Text("Options", titleLabelStyle);
    centerElementX(title);
    title.y = 20;
    
    let fpsButton = new PIXI.Text("Show FPS", toggleButtonStyle);
    centerElementX(fpsButton);
    fpsButton.y = 300;
    fpsButton.interactive = true;
    fpsButton.buttonMode = true;

    //have to do custom logic since the color technically changes
    fpsButton.on("pointerover", (e) => e.target.style.fill = 0xaaaaaa);
    fpsButton.on("pointerout", (e) =>  e.target.style.fill = showFPS ? lightGreen:lightRed);
    fpsButton.on("pointerup", (e) => 
        {
            showFPS = !showFPS;
            e.target.style.fill = showFPS ? lightGreen:lightRed;
        }
    );

    optionsScene.start = () =>
    {
        fpsButton.style.fill = showFPS ? lightGreen:lightRed;
    }
    
    
    
    let backButton = new PIXI.Text("Go Back", stdButtonStyle);
    centerElementX(backButton);
    backButton.y = 600;
    backButton.interactive = true;
    backButton.buttonMode = true;
    defaultButtonLogic(backButton, lightGreen, stdButtonStyle.fill, (e) => switchScene("start"));

    optionsScene.addChild(title);
    optionsScene.addChild(fpsButton);
    optionsScene.addChild(backButton);

    //#endregion

    //#region CREDITS SCENE

    let creditsScene = scenes.createNewScene("credits");

    title = new PIXI.Text("Credits", titleLabelStyle);
    centerElementX(title);
    title.y = 20;

    let creds = new PIXI.Text("A project by Zach A", stdLabelStyle);
    centerElementX(creds);
    creds.y = HEIGHT/2 - 30;
    
    let otherCreds = new PIXI.Text("Made for IGME 235 | Intro to Game Web Tech", stdLabelStyle);
    centerElementX(otherCreds);
    otherCreds.y = HEIGHT/2 + 30;

    backButton = new PIXI.Text("Go Back", stdButtonStyle);
    centerElementX(backButton);
    backButton.y = 600;
    backButton.interactive = true;
    backButton.buttonMode = true;
    defaultButtonLogic(backButton, lightGreen, stdButtonStyle.fill, (e) => switchScene("start"));
    



    creditsScene.addChild(title);
    creditsScene.addChild(creds);
    creditsScene.addChild(otherCreds);
    creditsScene.addChild(backButton);
    //#endregion



    //scene 2 - game scene
    let gameScene = scenes.createNewScene("game");
    gameScene.cursor = "url(media/cursor.png) 32 32, crosshair";

    
    let elapsedTimeListener = new Listener(-1);
    let roundedTimeListener = new Listener(-1);
    let fpsListener = new Listener(0);
    let fps = new PIXI.Text("", stdLabelStyle);

    fpsListener.addCallback((frames) => 
        {
            fps.text = `${frames} FPS`;
        });
    
    fps.x = WIDTH - 10;
    fps.y = 10;
    fps.anchor.set(1,0);
    
    let time = new PIXI.Text("", stdLabelStyle);
    time.x = 10;
    time.y = 10;
    
    elapsedTimeListener.addCallback((time) => roundedTimeListener.setValue(Math.floor(time)));
    roundedTimeListener.addCallback((r_time) => 
        {
            time.text = `${r_time}`;
        });


    let buildingManager = new BuildingSummoner(gameScene, new Vector2(-150, 0), ["media/building1.png", "media/building2.png"]);
    
    let bg = new PIXI.Sprite(await PIXI.Assets.load('bg2'));
    gameScene.addChild(bg);


    let player = new Player(await PIXI.Assets.load('player'), TILE_SIZE*4, TILE_SIZE*4);
    player.ChargeTime.addCallback((time) => {
        console.log(`Charge Time: ${time}`);
    })

    player.OnPlayerDead = () => switchScene("death");
    player.OnJump = () => jumpSound.play();

    gameScene.addChild(fps);
    gameScene.addChild(time);
    
    gameScene.addChild(buildingManager);
    gameScene.addChild(player);

    gameScene.start = () =>
    {
        elapsedTimeListener.setValue(0);
        player.resetState();
        //update on start because why not
        fps.visible = showFPS;
        app.renderer.background.color = 0x000000;
        buildingManager.reset();
    };
    gameScene.update = (dt) => {

        elapsedTimeListener.setValue(elapsedTimeListener.getValue() + dt);

        buildingManager.spawnTimer.setValue(buildingManager.spawnTimer.getValue() - dt);

        buildingManager.updateMovement(dt);

        player.checkCollisions(buildingManager);
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
        //get relative position of cursor to the canvas
        let rect = canvas.getBoundingClientRect();
        let rel_x = e.clientX - rect.left;
        let rel_y = e.clientY - rect.top;
        player.MousePosition = new Vector2(rel_x, rel_y);
    }


//#region DEATH SCREEN

    let deathScreen = scenes.createNewScene("death");
    
    title = new PIXI.Text("You Died!", titleLabelStyle);
    centerElementX(title);
    title.y = 20;

    deathScreen.start = () =>
    {
        app.renderer.background.color = 0x005217;
    }
    

    let retry = new PIXI.Text("Retry", stdButtonStyle);
    centerElementX(retry);
    retry.y = 400;
    retry.interactive = true;
    retry.buttonMode = true;
    defaultButtonLogic(retry, lightGreen, stdButtonStyle.fill, (e) => switchScene("game"));

    backButton = new PIXI.Text("Main Menu", stdButtonStyle);
    centerElementX(backButton);
    backButton.y = 600;
    backButton.interactive = true;
    backButton.buttonMode = true;
    defaultButtonLogic(backButton, lightGreen, stdButtonStyle.fill, (e) => switchScene("start"));

    deathScreen.addChild(title);
    deathScreen.addChild(retry);
    deathScreen.addChild(backButton);



//#endregion







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

    //update the current scene with deltatime
    scenes.update(dt);
}

async function switchScene(id = "")
{
    //set the scene
    await scenes.setScene(id);

    //if error, freak out!
    if (scenes.currentScene == undefined)
    {
        console.log("Error finding " + id + " in loaded scenes. Check spelling!");
    }
}
