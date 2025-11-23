const { Scene } = require("./Scene");

class SceneManager extends PIXI.Container {
    #scenes;

    constructor() {
        this.#scenes = new Map();
        this.currentScene = undefined;
    }

    createNewScene(id) {
        let scene = new Scene(id);
        this.#scenes.set(id, scene);

        return scene;
    }

    async setScene(id) {
        if (!this.#scenes.has(id)) {
            console.log("Scene does not exist with id " + id + "!");
            return;
        }

        let scene = this.#scenes.get(id);
        await scene.initialize();

        this.currentScene = scene;
    }

    update(dt = 1 / 60) {
        this.currentScene.children.forEach(element => {
            element.update(dt);
        });
    }




    free() {
        for (const [key, value] of this.#scenes) {
            value.unload();
        }
    }
}
