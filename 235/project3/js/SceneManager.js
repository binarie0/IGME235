//const { Scene } = require("./Scene");

class SceneManager extends PIXI.Container {
    #scenes;
    stage;
    currentScene;


    constructor(stage) {
        super();
        this.stage = stage;
        this.#scenes = new Map();
        this.currentScene = undefined;
    }

    createNewScene(id) {
        let scene = new Scene(id);
        this.#scenes.set(id, scene);
        return scene;
    }

    async setScene(id) {

        //make sure scene exists
        if (!this.#scenes.has(id)) {
            console.log("Scene does not exist with id " + id + "!");
            return;
        }
        
        //get the scene and initialize
        let scene = this.#scenes.get(id);
        await scene.initialize();
        
        //if a scene is already instantiated here, remove that child so that it doesn't draw
        if (this.currentScene != undefined)
            this.stage.removeChild(this.currentScene);
        
        //set the scene and add it to stage since it wasnt added before. this saves the amount of things that need to be checked in order to draw
        this.currentScene = scene;
        this.stage.addChild(this.currentScene);
    }

    //updates game
    update(dt = 1 / 60) {
        this.currentScene.update(dt);
    }



    //free the memory
    free() {
        for (const [,value] of this.#scenes) {
            value.unload();
        }
    }
}
