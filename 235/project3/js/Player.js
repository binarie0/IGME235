class Player extends PIXI.AnimatedSprite
{
    #frames;
    PlayerState = new Listener(this.PLAYER_STATE.STATIONARY);
    #textures;

    PLAYER_STATE = Object.freeze({
        STATIONARY: 0,
        CHARGING: 1,
        JUMPING: 2
    });



    constructor()
    {
        this.#textures = PIXI.Texture.from("media/player.png");
    }
}