class NineTileSprite extends PIXI.Container
{

    TILETYPES = Object.freeze({
        TOPLEFT:0,
        TOPCENTER:1,
        TOPRIGHT:2,
        CENTERLEFT:3,
        CENTER:4,
        CENTERRIGHT:5,
        BOTTOMLEFT:6,
        BOTTOMCENTER:7,
        BOTTOMRIGHT:8
    })

    tiles = [];

    constructor(baseSprite = new NineTileSprite("", 32, 32))
    {
        for (let i = 0; i < 9; i++)
        {
            let texture = baseSprite.tiles[i].texture;
            this.tiles.push(new PIXI.Sprite(texture));
        }
    }


    constructor(imagePath = "", width = 32, height = 32)
    {
        super();

        let textures = PIXI.Texture.from(imagePath);

        for (let i = 0; i < 9; i++)
        {
            let spr = new PIXI.Texture({
                source: textures,
                frame: new PIXI.Rectangle(width*((i % 3).toFixed(0)), height * ((i / 3).toFixed(0)), width, height)
            });
            
            this.tiles.push(new PIXI.TilingSprite(spr));
        }
    }

    setSize(width = 3, height = 3)
    {
        //only need to scale 1,3,5,7

        // @
        //@ @
        // @

        //and then scale the inner dimensions to 2 minus the width and height
    }
}