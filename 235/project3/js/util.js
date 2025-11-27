function clamp(num, lower, upper) {
    return Math.min(Math.max(num, lower), upper);
}

function centerElementX(e = new PIXI.Text(""), sceneWidth)
{
    e.x = sceneWidth/2 - e.width/2
}

function centerElementY(e = new PIXI.Text(""), sceneHeight)
{
    e.y = sceneHeight/2 - e.height/2;
}

function defaultButtonLogic(element, hoverColor, defaultColor, onclick = (event) => {})
{
    element.on("pointerover", (e) => e.target.style.fill = hoverColor);
    element.on("pointerout", (e) => e.target.style.fill = defaultColor);
    element.on("pointerup", onclick);
}