class Player extends PIXI.Container
{
    MAX_CHARGE_TIME = Object.freeze(2);
    PLAYER_STATE = Object.freeze({
        STATIONARY: 0,
        CHARGING: 1,
        JUMPING: 2
    });

    PlayerState = new Listener(this.PLAYER_STATE.STATIONARY);
    
    ChargeTime = new Listener(0);


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
        /* TODO: UNCOMMENT WHEN PLAYER IS SET UP
        console.log("Player state changed!");
        for (const a of this.#animations)
        {
            a.gotoAndStop(0);
            a.visible = false;
        }

        this.#animations[state].play();
        this.#animations[state].visible = true;
        */
        
    }

    resetState(state)
    {
        //force reset state
        this.PlayerState.setValue(this.PLAYER_STATE.STATIONARY);
        this.#updatePlayer(this.PLAYER_STATE.STATIONARY);
    }


    update(dt = 1/60)
    {
        if (this.PlayerState.getValue() == this.PLAYER_STATE.CHARGING)
        {
            //effectively update the charge time param. this exposure via listening will allow other things to update while this charge is happening. This also allows for a response-only approach, where things don't need to check things themselves, just respond to changes

            let ct = this.ChargeTime.getValue();
            
            if (ct < this.MAX_CHARGE_TIME)
            {
                let total = Math.min(ct + dt, this.MAX_CHARGE_TIME);
                this.ChargeTime.setValue(total);
            }
        }
    }

    onStartJump()
    {
        if (this.PlayerState.getValue() != this.PLAYER_STATE.JUMPING)
        {
            this.PlayerState.setValue(this.PLAYER_STATE.CHARGING);
            
        }
    }

    onJump()
    {
        if (this.PlayerState.getValue() == this.PLAYER_STATE.CHARGING)
        {
            this.PlayerState.setValue(this.PLAYER_STATE.JUMPING);
            let totalTime = this.ChargeTime.getValue();
            this.ChargeTime.setValue(0);

            //TODO: use totalTime to calculate the distance mr player will go
        }
    }
}