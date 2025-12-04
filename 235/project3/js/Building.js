class Building extends PIXI.NineSliceSprite
{

    constructor(imagePath, tileSize = 32)
    {
        super({
            texture: PIXI.Texture.from(imagePath),
            leftWidth: tileSize,
            topHeight: tileSize,
            rightWidth: tileSize,
            bottomHeight: tileSize,
            width: tileSize*3,
            height: tileSize*3,
        });
        this.tileSize = tileSize;
        this.buildWidth = new Listener(3);
        this.buildHeight = new Listener(3);

        this.buildHeight.addCallback((_) => this.#recalculateBuilding(_));
        this.buildWidth.addCallback((_) => this.#recalculateBuilding(_));
        this.anchor.set(0, 1);
    }
    
    #recalculateBuilding(__)
    {
        this.width = this.tileSize * this.buildWidth.getValue();
        this.height = this.tileSize * this.buildHeight.getValue();
    }

}

