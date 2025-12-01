class SixTileSprite extends PIXI.Container
{

    TILETYPES = Object.freeze({
        TOPLEFT:0,
        TOPCENTER:1,
        TOPRIGHT:2,
        BOTTOMLEFT:3,
        BOTTOMCENTER:4,
        BOTTOMRIGHT:5,
    })

    tiles = [];

    constructor(baseSprite = new SixTileSprite("", 32, 32))
    {
        for (let i = 0; i < 9; i++)
        {
            let texture = baseSprite.tiles[i].texture;
            this.tiles.push(new PIXI.Sprite(texture));
        }
        this.maintainTopScale = baseSprite.maintainTopScale;
    }


    constructor(imagePath = "", width = 32, height = 32, maintainTopScale = true)
    {
        super();
        this.tileWidth = width;
        this.tileHeight = height;
        this.maintainTopScale = maintainTopScale;

        let textures = PIXI.Texture.from(imagePath);

        for (let i = 0; i < 6; i++)
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
        if (width < 1 || height < 1)
            throw RangeError("Width and height must be at least 1");
        
        this.#setWidth(width);
        this.#setHeight(height);

    }
    #setWidth(width = 3)
    {
        if (width == 1)
        {
            //only use middle piece
            return;
        }

        if (width == 2)
        {
            //cut out middle piece
            return;
        }

        //scale accordingly.
    }
    #setHeight(height = 3)
    {
        if (this.maintainTopScale)
        {
            //scale indices 3, 4, 5

            return;
        }

        //scale indices 0, 1, 2
        
    }
}