import { ExtensiveQuantity } from "../types/extensiveQuantity";


export class MassFlow implements ExtensiveQuantity {
    amount: number;
    amountNextIteration: number;
    delta: number;
    constructor() {
        this.amount = 0;
        this.amountNextIteration = 0;
        this.delta = 0;
    }
}