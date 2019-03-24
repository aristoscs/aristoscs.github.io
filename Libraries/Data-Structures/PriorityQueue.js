function PriorityQueue(comparator) {

    this.heap = [];
    this.size = 0;

    this.comparator = comparator;

    this.isEmpty = function () {
        return this.size === 0;
    };

    this.enqueue = function (item) {
        this.heap[this.size++] = item;
        this.heapifyUp(this.size - 1);
    };

    this.heapifyUp = function (index) {
        let element = this.heap[index];
        while (index > 0 && this.comparator(element, this.heap[this.getParent(index)]) < 0) {
            this.heap[index] = this.heap[this.getParent(index)];
            index = this.getParent(index);
        }
        this.heap[index] = element;
    };

    this.getParent = function (index) {
        return (index - 1) >> 1;
    };

    this.dequeue = function () {
        let element = this.heap[0];
        this.heap[0] = this.heap[this.size - 1];
        this.size -= 1;
        this.heapifyDown(0);
        return element;
    };

    this.heapifyDown = function (index) {
        let element = this.heap[index];
        while (this.kthChild(index, 1) < this.size) {
            let min = this.minChild(index);

            if (this.comparator(element, this.heap[min]) < 0)
                break;

            this.heap[index] = this.heap[min];
            index = min;
        }
        this.heap[index] = element;
    };

    this.kthChild = function (index, childNumber) {
        return (index << 1) + childNumber;
    };

    this.minChild = function (index) {
        let i = this.kthChild(index, 1);
        let c1 = this.heap[i];
        let c2 = this.heap[i + 1];
        if (this.comparator(c1, c2) <= 0)
            return i;
        else
            return i + 1;
    }
}
