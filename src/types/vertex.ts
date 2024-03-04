import { IterativeElement } from "./iterativeElement";
import { Link } from "./link";

export class Vertex extends IterativeElement {
    [x: string]: any;

    private _linksBalance: number;

    private _type: VertexType;

    constructor(value?: number) {
        super(value);

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
                this._linksBalance = this._linksBalance + link.GetValue();
            });
        }

        if (this._type != VertexType.Sink) {
            this._Outboundlinks.forEach(link => {
                this._linksBalance = this._linksBalance - link.GetValue();
            });
        }

        return this._linksBalance;
    }

    public get IsBalanced(): boolean { return Math.abs(this.Balance) < this._epsilon; }

}

export enum VertexType {
    Source = "Source",
    Sink = "Sink",
    Intermediate = "Intermediate"
}
