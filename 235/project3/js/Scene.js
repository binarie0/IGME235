///A scene
class Scene extends PIXI.Container {

    update = (dt) => {};
    start = () => {};

    constructor(id) {
        super();
        this.children = [];
        this.active = false;
        this.assets = undefined;
        this.id = id;
    }



    async initialize() {
        this.assets = await PIXI.Assets.loadBundle(this.id, (progress) => console.log(`progress=${(progress * 100).toFixed(2)}%`));
        this.start();
        console.log(this.id + " scene loaded!");
    }

    add(child) {
        this.addChild(child);
        this.children.push(child);
    }

    async unload() {
        await PIXI.Assets.unloadBundle(this.id);
        console.log(id + " scene unloaded!");
    }
}