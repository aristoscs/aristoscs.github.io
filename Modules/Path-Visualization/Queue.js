function Queue() {

    this.queue = [];
    this.offset = 0;

    this.enqueue = function (item) {
        this.queue.push(item);
    };

    this.isEmpty = function () {
        return this.queue.length === 0;
    };

    this.dequeue = function () {
        if (this.isEmpty())
            return undefined;

        let item = this.queue[this.offset];
        if (++this.offset * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset);
            this.offset = 0;
        }
        return item;
    };
}
