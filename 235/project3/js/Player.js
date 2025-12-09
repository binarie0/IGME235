class Player extends PIXI.Container
{
    //constant for max charge time
    MAX_CHARGE_TIME = Object.freeze(2);
    POWER = Object.freeze(800);

    //ENUM: player states
    PLAYER_STATE = Object.freeze({
        STATIONARY: 0,
        CHARGING: 1,
        JUMPING: 2
    });

    MousePosition = new Vector2(0, 0);

    //this is so things can tie themselves to changes in player state
    PlayerState = new Listener(this.PLAYER_STATE.STATIONARY);
    
    OnPlayerDead = () => {};
    OnJump = () => {};
    
    //this is so things can tie themselves to changes in chargetime
    ChargeTime = new Listener(0);
    #canCharge = false;

    ignoredBuilding = null;

    Velocity = new Vector2(0,0);

    Gravity = new Vector2(0, this.POWER*0.5);

    #offsetX;
    #offsetY;


    constructor(textures, width, height)
    {
        super();
        
        //set the draw point and the position point to the center
        //the player spritesheet is built
        //stationary (idle) x8
        //charging x8
        //jumping x8
        this.#offsetX = width/2;
        this.#offsetY = height/2;
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
            //anim.anchor.set(0.5, 0.5);
            
            if (i != 0) anim.loop = false;
            anim.visible = false;
            //console.log(anim);
            this.addChild(anim);
        }
        this.pivot.set(width*0.5, height*0.5);
        //this.position = new Vector2(this.#offsetX, HEIGHT - this.#offsetY);
        this.PlayerState.addCallback((state) => this.#updatePlayer(state));
    }

    checkCollisions(bs = new BuildingSummoner(null, new Vector2(), null))
    {
        bs.buildings.forEach((b) =>
        {
            
            if (b != this.ignoredBuilding && rectsIntersect(this, b))
            {
                if (!isLeftOnTopOfRight(this, b))
                {
                    this.Velocity = Vector2.add(bs.speed, this.Velocity.componentVectors.y);
                }
                else
                {
                    this.position.y = b.getBounds().y - this.#offsetY;
                    this.Velocity = bs.speed;
                    this.PlayerState.setValue(this.PLAYER_STATE.STATIONARY);
                    this.ignoredBuilding = b;
                }
            }
        });
    }

    #updatePlayer(state = 0)
    {
        console.log(this.children);
        console.log("Player state changed!");
        for (const element of this.children)
        {
            element.gotoAndStop(0);
            element.visible = false;
        }

        this.children[state].play();
        this.children[state].visible = true;
        
    }

    resetState(state)
    {
        this.position = new Vector2(this.#offsetX + 2, HEIGHT - this.#offsetY);
        this.Velocity = Vector2.ZERO;
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

        let pos = this.position;
        let vel = this.Velocity;
        let grav = this.PlayerState.getValue() == this.PLAYER_STATE.JUMPING ? Vector2.mult(dt, this.Gravity) : Vector2.ZERO;
            
        this.Velocity = Vector2.add(vel, grav);
        if (this.Velocity.y > 0) this.ignoredBuilding = null;
        let dpos = Vector2.mult(dt, this.Velocity);
            
        this.position = Vector2.add(pos, dpos);
        if (this.position.y > HEIGHT - this.#offsetY)
        {
            this.position.y = HEIGHT - this.#offsetY;
            this.PlayerState.setValue(this.PLAYER_STATE.STATIONARY);
            this.Velocity = Vector2.ZERO;
        }
        if (this.position.y < this.#offsetY)
        {
            this.position.y = this.#offsetY;
            this.Velocity = this.Velocity.componentVectors.x;
        }
        if (this.position.x < -this.#offsetX)
        {
            this.OnPlayerDead();
        }
        if (this.position.x > WIDTH - this.#offsetX)
        {
            this.position.x = WIDTH - this.#offsetX;
            this.Velocity = this.Velocity.componentVectors.y;
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
            let totalTime = this.ChargeTime.getValue();
            this.ChargeTime.setValue(0);
            totalTime = Math.max(0.1, totalTime);
            
            console.log(this.MousePosition);
            let dir = Vector2.sub(this.MousePosition, Vector2.add(this.position, this.pivot));
            dir = dir.normalized;
            if (dir.y > 0) 
            {
                this.PlayerState.setValue(this.PLAYER_STATE.STATIONARY);
                return;
            }
            
            this.PlayerState.setValue(this.PLAYER_STATE.JUMPING);
            

            this.Velocity = Vector2.mult(Math.sqrt(totalTime) * this.POWER, dir);
            this.OnJump();


        }
    }
}

