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