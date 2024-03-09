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

    public get Type(): VertexType {
        return this._type;
    }

    private _Inboundlinks: Link[] = [];
    private _Outboundlinks: Link[] = [];

    public get Balance(): number {
        const input = this._Inboundlinks.reduce((sum, link) => sum + link.GetValue(), 0);
        const output = this._Outboundlinks.reduce((sum, link) => sum + link.GetValue(), 0);

        this._linksBalance = input - output;

        return this._linksBalance;
    }

    public get IsBalanced(): boolean {
        // Source and sink vertices are always balanced
        if (this._type != VertexType.Intermediate) return true;

        return Math.abs(this.Balance) < this._epsilon;
    }

}

export enum VertexType {
    Source = "Source",
    Sink = "Sink",
    Intermediate = "Intermediate"
}
