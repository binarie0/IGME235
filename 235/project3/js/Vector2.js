class Vector2 {

    #x;
    #y;

    /**The x component of the vector. */
    get x
    ()
    {
        return this.#x;
    }

    /**The y component of the vector. */
    get y()
    {
        return this.#y;
    }

    constructor(x = 0.0, y = 0.0)
    {
        this.#x = x;
        this.#y = y;
    }

    

    /**The length of the vector. */
    get length()
    {   
        let num = Math.sqrt(this.lengthSquared);
        return num;
    }

    /**The length squared.*/
    get lengthSquared()
    {
        return this.#x * this.#x + this.#y * this.#y;
    }

    /**
     * The normalized vector.
     */
    get normalized()
    {
        
        return Vector2.mult(1/this.length, this);
    }

    /** The vector with its axes flipped.
     * 
     */
    get yx()
    {
        return new Vector2(this.#y, this.#x);
    }

    /**The component vectors as individual axes.
     * Returns
     * {x:{Vector2}, y:{Vector2}}.
     */
    get componentVectors()
    {
        return {x: new Vector2(this.#x, 0), y: new Vector2(0, this.#y)};
    }


    /** Scalar multiplies a vector by a float
     * 
     * @param {number} left the float value to multiply
     * @param {Vector2} right the vector to multiply
     * @returns 
     */
    static mult(left = 1.0, right = new Vector2())
    {
        return new Vector2(right.x * left, right.y * left);
    }

    /**Adds two vectors.
     * 
     * @param {Vector2} left the vector on the left
     * @param {Vector2} right the vector on the right 
     * @returns 
     */
    static add(left = new Vector2(), right = new Vector2())
    {
        return new Vector2(left.x + right.x, left.y + right.y);
    }

    /**
     * Subtracts two vectors.
     * @param {Vector2} left the vector on the left 
     * @param {Vector2} right the vector on the right 
     * @returns 
     */
    static sub(left = new Vector2(), right = new Vector2())
    {
        return new Vector2(left.x - right.x, left.y - right.y);
    }

    /**
     * Converts an input that has characteristics similar to a Vector2 into a Vector2
     * @param {any} input An input with {x,y} as a characteristic
     * @returns
     */
    static fromVector2Like(input = {x,y})
    {
        return new Vector2(input.x, input.y);
    }

    /**Converts a vector input into a similar-to-vector output
     * 
     * @param {*} input 
     * @returns 
     */
    static toVector2Like(input = new Vector2(0,0))
    {
        return {x: input.x, y: input.y};
    }
}
