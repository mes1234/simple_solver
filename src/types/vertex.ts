import { Link } from "./link";

export class Vertex {
    private _value: number;
    private _valueNext: number;
    private _epsilon = 0.0001;

    private _linksBalance: number;

    private _type: VertexType;

    constructor() {
        this._value = 0.0;
        this._valueNext = this._value;
        this._linksBalance = 0.0;

        this._type = VertexType.Intermediate;
    }

    public AttachUpstreamLink(link: Link) {
        this._Inboundlinks.push(link);
    }


    public AttachDownstreamLink(link: Link) {
        this._Outboundlinks.push(link);
    }

    public set Type(type: VertexType) {
        this._type = type;
    }

    private _Inboundlinks: Link[] = [];
    private _Outboundlinks: Link[] = [];

    public get Balance(): number {

        if (this._type != VertexType.Source) {
            this._Inboundlinks.forEach(link => {
                this._linksBalance = this._linksBalance + link.Value;
            });
        }

        if (this._type != VertexType.Sink) {
            this._Outboundlinks.forEach(link => {
                this._linksBalance = this._linksBalance - link.Value;
            });
        }

        return this._linksBalance;
    }

    public get IsBalanced(): boolean { return Math.abs(this.Balance) < this._epsilon; }

    public get Value(): number {
        return this._value;
    }

    public Adjust() {
        this._value = this._value - (this._value - this._valueNext) * 0.1;
    }

    public set Value(value: number) {
        this._valueNext = value;
    }
}

export enum VertexType {
    Source = "Source",
    Sink = "Sink",
    Intermediate = "Intermediate"
}
