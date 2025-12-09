function clamp(num, lower, upper) {
    return Math.min(Math.max(num, lower), upper);
}

function centerElementX(e = new PIXI.Text(""))
{
    e.x = WIDTH/2 - e.width/2
}

function centerElementY(e = new PIXI.Text(""))
{
    e.y = HEIGHT/2 - e.height/2;
}

function defaultButtonLogic(element, hoverColor, defaultColor, onclick = (event) => {})
{
    element.on("pointerover", (e) => e.target.style.fill = hoverColor);
    element.on("pointerout", (e) =>  e.target.style.fill = defaultColor);
    element.on("pointerup", (e) => {onclick(e); e.target.style.fill = defaultColor});
}

function random(min = 0, max = 0, floor = true)
{
    let val = min + Math.random() * (max - min);
    return floor?Math.floor(val) : val;
}

// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a,b){
	let ab = a.getBounds();
	let bb = b.getBounds();
	return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function isLeftToLeftOfRight(a,b)
{
    let ab = a.getBounds();
    let bb = b.getBounds();
    return ab.x + ab.width > bb.x;
}

function isLeftOnTopOfRight(a, b)
{
    const padding = 15;
    let ab = a.getBounds();
    let bb = b.getBounds();

    return ab.y + ab.height < bb.y + padding;
}