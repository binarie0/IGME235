///A scene
export class Scene extends PIXI.Container {
    constructor(id) {
        super();
        this.children = [];
        this.active = false;
        this.assets = undefined;
        this.id = id;
    }

    async initialize() {
        assets = await PIXI.Assets.loadBundle(this.id, (progress) => console.log(`progress=${(progress * 100).toFixed(2)}%`));
        this._start();
        console.log(id + " scene loaded!");
    }

    add(child) {
        this.addChild(child);
        this.children.push(child);
    }

    _start() { }

    async unload() {
        await PIXI.Assets.unloadBundle(this.id);
        console.log(id + " scene unloaded!");
    }
}
