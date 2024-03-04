export abstract class IterativeElement {

    protected _value: number;
    protected _valueNext: number;
    protected _epsilon = 0.0001;
    protected _adjustmentRate = 0.5;

    constructor(public value?: number) {
        this._value = value ?? 0.0;
        this._valueNext = value ?? 0.0;
    }

    public GetValue(): number {
        return this._value;
    }

    public SetValue(value: number): void {
        this._valueNext = value;
    }

    Flip() {
        this._value = this._value - (this._value - this._valueNext) * this._adjustmentRate;
    }
}