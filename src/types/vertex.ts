import { ExtensiveQuantity } from "./extensiveQuantity"
import { IntensiveQuantity } from "./intensiveQuantity";
import { Link } from "./link";

export class Vertex<T extends IntensiveQuantity, U extends ExtensiveQuantity> {
    private _value: T;
    private _valueNext: T;
    private _epsilon = 0.0001;

    private _balance: U;

    private _type: VertexType;

    constructor(intensiveQuantity: { new(): T }, extensiveQuantity: { new(): U }) {
        this._value = new intensiveQuantity();
        this._valueNext = this._value;
        this._balance = new extensiveQuantity();

        this._type = VertexType.Intermediate;
    }

    public AttachUpstreamLink(link: Link<T, U>) {
        this._Inboundlinks.push(link);
    }


    public AttachDownstreamLink(link: Link<T, U>) {
        this._Outboundlinks.push(link);
    }

    public set Type(type: VertexType) {
        this._type = type;
    }

    private _Inboundlinks: Link<T, U>[] = [];
    private _Outboundlinks: Link<T, U>[] = [];

    public get Balance(): U {

        if (this._type != VertexType.Source) {
            this._Inboundlinks.forEach(link => {
                this._balance.amount = this._balance.amount + link.Value.amount;
            });
        }

        if (this._type != VertexType.Sink) {
            this._Outboundlinks.forEach(link => {
                this._balance.amount = this._balance.amount - link.Value.amount;
            });
        }

        return this._balance;
    }

    public get IsBalanced(): boolean { return Math.abs(this.Balance.amount) < this._epsilon; }

    public get Value(): T {
        return this._value;
    }

    public Adjust() {
        this._value.amount = this._value.amount - (this._value.amount - this._valueNext.amount) * 0.1;
    }

    public set Value(value: T) {
        this._valueNext = value;
    }
}

export enum VertexType {
    Source = "Source",
    Sink = "Sink",
    Intermediate = "Intermediate"
}
