export class ValueStabilityAnalyzer {
    private buffer: number[];
    private start: number = 0;
    private end: number = 0;

    constructor(private capacity: number = 10) {
        this.buffer = new Array(capacity);
    }

    write(item: number): void {
        this.buffer[this.end] = item;
        this.end = (this.end + 1) % this.capacity;
        if (this.end === this.start) {
            this.start = (this.start + 1) % this.capacity;
        }
    }

    read(): number | null {
        if (this.isEmpty()) {
            return null;
        }
        const item = this.buffer[this.start];
        this.start = (this.start + 1) % this.capacity;
        return item;
    }

    isEmpty(): boolean {
        return this.start === this.end;
    }

    isFluctuating(): boolean {

        if (this.isMonotonic(this.buffer)) return false;

        const sum = this.buffer.reduce((a, b) => a + b, 0);
        const avg = sum / this.buffer.length;

        const variance = this.buffer.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.buffer.length;

        const fluctuationTooHigh = variance / avg > 0.1

        return fluctuationTooHigh;
    }

    isMonotonic(array: number[]): boolean {
        if (array.length <= 2) {
            return true;
        }

        let direction = array[1] - array[0];
        for (let i = 2; i < array.length; i++) {
            if (direction === 0) {
                direction = array[i] - array[i - 1];
                continue;
            }
            if (this.breaksDirection(direction, array[i - 1], array[i])) {
                return false;
            }
        }

        return true;
    }

    breaksDirection(direction: number, previous: number, current: number): boolean {
        const difference = current - previous;
        if (direction > 0) {
            return difference < 0;
        }
        return difference > 0;
    }
}
