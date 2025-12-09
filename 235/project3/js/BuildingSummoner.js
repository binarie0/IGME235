class BuildingSummoner extends PIXI.Container {

    TIME_OFFSET = Object.freeze(1);
    buildings = [];
    spawnTimer = new Listener(0);

    constructor(scene = new Scene(""), speedPerFrame = new Vector2(0, 0), buildingStyles = []) {
        super();
        this.speed = speedPerFrame;
        this.scene = scene;
        this.buildingStyles = buildingStyles;
        this.spawnTimer.addCallback((e) => {
            if (e <= 0) this.#addBuilding();
        });
    }
    
    reset()
    {
        this.buildings.forEach(b => this.scene.removeChild(b));
        this.buildings = [];
    }



    #addBuilding() {
        console.log("building added!");

        let a = this.buildingStyles[Math.floor(Math.random() * this.buildingStyles.length)];
        console.log(a);

        let b = new Building(a, 32, 32);
        b.position.set(WIDTH, HEIGHT);

        if (this.buildings.length > 0) {
            b.buildHeight.setValue(random(2, 12));
        }

        else {
            b.buildHeight.setValue(random(5, 8));
        }
        b.buildWidth.setValue(random(7, 15));
        this.buildings.push(b);
        this.scene.addChild(b);
        this.spawnTimer.setValue(b.width / this.speed.length + this.TIME_OFFSET);
    }

    updateMovement(dt = 1 / 60) {
        let dist = Vector2.mult(dt, this.speed).x;
        //update each building
        this.buildings.forEach((b) => {

            b.x += dist;

            //remove child if the building is out of zone
            if (b.x < -b.width) {
                this.scene.removeChild(b);
            }
        });

        //filter out so that we do not keep referencing a building not in scene
        this.buildings = this.buildings.filter((b) => b.x > -b.width);
    }
}
