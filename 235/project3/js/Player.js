class Player extends PIXI.Container
{
    
    PLAYER_STATE = Object.freeze({
        STATIONARY: 0,
        CHARGING: 1,
        JUMPING: 2
    });

    PlayerState = new Listener(this.PLAYER_STATE.STATIONARY);
    


    #animations = [];


    constructor()
    {
        super();
        let width=32, height = 32;
        let textures = PIXI.Texture.from("media/player.png");
        for (let i = 0; i < 3; i++)
        {
            let textureArray = [];
            for (let j = 0; j < 8; j++)
            {
                let frame = new PIXI.Texture({
                    source: textures,
                    frame: new PIXI.Rectangle(j*width, height*i, width, height)
                });
                textureArray.push(frame);
            }
            let anim = new PIXI.AnimatedSprite(textureArray);
            this.#animations.push(anim);
            this.addChild(anim);
        }

        this.PlayerState.addCallback(this.#updatePlayer);
    }

    #updatePlayer(state)
    {
        console.log("Player state changed!");
        for (const a of this.#animations)
        {
            a.goToAndStop(0);
            a.visible = false;
        }

        this.#animations[state].play();
        this.#animations[state].visible = true;
    }

    resetState(state)
    {
        //force reset state
        this.#updatePlayer(this.PLAYER_STATE.STATIONARY);
    }
}