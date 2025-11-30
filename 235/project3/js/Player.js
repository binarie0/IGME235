class Player extends PIXI.Container
{
    //constant for max charge time
    MAX_CHARGE_TIME = Object.freeze(2);

    //ENUM: player states
    PLAYER_STATE = Object.freeze({
        STATIONARY: 0,
        CHARGING: 1,
        JUMPING: 2
    });

    //this is so things can tie themselves to changes in player state
    PlayerState = new Listener(this.PLAYER_STATE.STATIONARY);
    
    //this is so things can tie themselves to changes in chargetime
    ChargeTime = new Listener(0);


    
    //local animations for the player
    #animations = [];


    constructor(width, height)
    {
        super();
        //set the draw point and the position point to the center
        this.anchor.set(0.5, 0.5);
        let textures = PIXI.Texture.from("media/player.png");

        //the player spritesheet is built
        //stationary (idle) x8
        //charging x8
        //jumping x8
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

    //state machine change
    onStartJump()
    {
        if (this.PlayerState.getValue() != this.PLAYER_STATE.JUMPING)
        {
            this.PlayerState.setValue(this.PLAYER_STATE.CHARGING);
        }
    }

    //state machine change
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