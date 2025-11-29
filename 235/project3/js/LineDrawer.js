class LineDrawer
{
    graphics;
    #player;
    constructor(player = new Player())
    {
        this.#player = player;

        graphics = new PIXI.Graphics();
    }

    DrawLine(scene, chargeTime, mouseX, mouseY)
    {
        //1: get player position on screen
        let playerPosition = this.#player.position;
        //2: calculate the speed the player will go based on charge time
        
        //3: get the direction the player will go based on mouse position
        let direction = {x: mouseX - playerPosition.x, y: mouseY - playerPosition.y};

        //4: search for the landing destination within a certain range (300px)

        //5: destroy the previous line and draw the new one
        scene.removeChild(this.graphics);
        this.graphics.destroy();



        
    }





}