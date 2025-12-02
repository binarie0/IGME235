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

class   BuildingSummoner extends PIXI.Container
{
    #speed = 150;
    #buildings = [];
    constructor(scene = new Scene(""), buildingStyles = [])
    {
        super();
        this.scene = scene;
        this.buildingStyles = buildingStyles;
        this.spawnTimer.addCallback((e) => {
            if (e <= 0) this.#addBuilding()});
    }
    spawnTimer = new Listener(0);

    #addBuilding()
    {
        console.log("building added!");

        let a = this.buildingStyles[Math.floor(Math.random()*this.buildingStyles.length)];
        console.log(a);
        
        let b = new Building(a, 32, 32);
        b.position.set(1280, 720);

        if (this.#buildings.length > 0)
        {
            let top = this.#buildings[this.#buildings.length - 1];
            let r = random(-3, 8);
            if (r == 0) r +=1;
            b.buildHeight.setValue(clamp(top.buildHeight.getValue() + r, 2, 12));            
        }
        else
        {
            b.buildHeight.setValue(random(5, 8));     
        }
        b.buildWidth.setValue(random(7, 15));
        this.#buildings.push(b);
        this.scene.addChild(b);
        this.spawnTimer.setValue(b.width / this.#speed + 0.5);
    }

    updateMovement(dt = 1/60)
    {
        let stillStandingBuildings = [Building];
        this.#buildings.forEach((b) => 
        {
            b.x -= this.#speed*dt;
            
            if (b.x < -b.width)
            {
                this.scene.removeChild(b);
                console.log("hey what");
            }
        });

        this.#buildings = this.#buildings.filter((b) => b.x > -b.width);
    }
}