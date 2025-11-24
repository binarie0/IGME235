///A scene
class Scene extends PIXI.Container {

    onUpdate = (time) => {};
    onStart = (assetBundle) => {};
    onDraw = () => {};

    constructor(id) {
        super();
        this.children = [];
        this.active = false;
        this.assets = undefined;
        this.id = id;
    }



    async initialize() {
        this.assets = await PIXI.Assets.loadBundle(this.id, (progress) => console.log(`progress=${(progress * 100).toFixed(2)}%`));
        this.onStart(this.assets);
        console.log(this.id + " scene loaded!");
    }

    add(child) {
        this.addChild(child);
        this.children.push(child);
    }

    update(dt = 1/60)
    {
        this.onUpdate(dt);
    }

    draw()
    {
        this.onDraw();
    }

    async unload() {
        await PIXI.Assets.unloadBundle(this.id);
        console.log(id + " scene unloaded!");
    }
}