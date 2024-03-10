import { Link } from "./link";
import { Vertex } from "./vertex";

export abstract class IterativeElement {

    protected _value: number;
    protected _valueNext: number;
    protected _epsilon = 0.01;
    protected _adjustmentRate = 0.1;
    protected _minAdjustmentRate = 0.1;
    protected _type: ElementType;


    constructor(public value: number) {
        this._value = value;
        this._valueNext = value + 0.0001;
        this._type = ElementType.Intermediate;
    }

    public GetValue(): number {
        return this._value;
    }

    public SetValue(value: number): void {
        this._valueNext = value;
    }


    public set Type(type: ElementType) {
        this._type = type;
    }

    public get Type(): ElementType {
        return this._type;
    }

    Flip() {
        // Dont flip source and sink vertices
        if (this._type != ElementType.Intermediate) return;

        // Flip faster when the difference is bigger
        this._adjustmentRate = Math.abs((this._value - this._valueNext) / (this._value + this._valueNext));

        // If the difference is too small, flip slower
        if (this._adjustmentRate < this._minAdjustmentRate) {
            this._adjustmentRate = this._minAdjustmentRate;
        }

        // Flip the value if the difference is bigger than epsilon
        if (Math.abs(this._value - this._valueNext) > this._epsilon) {
            this._value = this._value - (this._value - this._valueNext) * this._adjustmentRate;
        }
    }
}


export enum ElementType {
    Source = "Source",
    Sink = "Sink",
    Intermediate = "Intermediate"
}

export type IntensiveFunc = (upstream: Vertex, link: Link) => number;
export type ExtensiveFunc = (upstream: Vertex, downstream: Vertex, link: Link) => number;