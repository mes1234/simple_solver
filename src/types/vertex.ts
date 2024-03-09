import { ElementType, IterativeElement } from "./iterativeElement";
import { Link } from "./link";

export class Vertex extends IterativeElement {
    [x: string]: any;

    private _linksBalance: number;
    constructor(value: number) {
        super(value);

        this._linksBalance = 0.0;
    }

    public AttachUpstreamLink(link: Link) {
        this._Inboundlinks.push(link);
    }


    public AttachDownstreamLink(link: Link) {
        this._Outboundlinks.push(link);
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
        if (this._type != ElementType.Intermediate) return true;

        return Math.abs(this.Balance) < this._epsilon;
    }

}

