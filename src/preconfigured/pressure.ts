import { IntensiveQuantity } from "../types/intensiveQuantity";

export class Pressure implements IntensiveQuantity {
    amount: number;
    amountNextIteration: number;
    delta: number;
    constructor() {
        this.amount = 0;
        this.amountNextIteration = 0;
        this.delta = 0;
    }
}