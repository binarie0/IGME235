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
        this.stage.addChild(scene);

        return scene;
    }

    async setScene(id) {
        if (!this.#scenes.has(id)) {
            console.log("Scene does not exist with id " + id + "!");
            return;
        }
        


        let scene = this.#scenes.get(id);
        await scene.initialize();
        
        if (this.currentScene != undefined)
            this.stage.removeChild(this.currentScene);

        this.currentScene = scene;
        this.stage.addChild(this.currentScene);
    }

    update(dt = 1 / 60) {
        this.currentScene.update(dt);
    }




    free() {
        for (const [,value] of this.#scenes) {
            value.unload();
        }
    }
}
