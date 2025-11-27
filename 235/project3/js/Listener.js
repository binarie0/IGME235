class Listener
{
    #value;
    #callbacks = [];

    constructor(val)
    {
        this.#value = val;
    }

    getValue()
    {
        return this.#value;
    }

    addCallback(callback = (val) => {})
    {
        if (callback.length != 1)
        {
            throw new Error("Incorrect format for callback, should only have one input.");
        }
        
        this.#callbacks.push(callback);
    }

    
    setValue(val)
    {
        if (this.#value == val)
        {
            return;
        }

        this.#value = val;
        this.#callbacks.forEach(c => c(this.#value));
    }
}