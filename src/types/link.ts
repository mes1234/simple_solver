import { IterativeElement } from "./iterativeElement";
import { Vertex } from "./vertex";

export class Link extends IterativeElement {

    // TODO make this variable
    dh = 1.0;
    L = 1.0;

    constructor(name: string, private _upstreamVertex: Vertex, private _downstreamVertex: Vertex, value: number) {

        super(name, value);

        this._upstreamVertex.AttachDownstreamLink(this);

        this._downstreamVertex.AttachUpstreamLink(this);
    }

    // Function to estimate flow value
    private funct?: LinkFunction;

    public AddFunc(f: LinkFunction) {
        this.funct = f;
    }

    public Calculate() {
        if (this.funct) {
            this.Value = this.funct(this._upstreamVertex, this._downstreamVertex, this);
        }
    }

    public get Description(): string {
        return `Link ${this.Name} from ${this._upstreamVertex.Name} to ${this._downstreamVertex.Name} with value ${this.Value}`;
    }
}

export type LinkFunction = (upstream: Vertex, downstream: Vertex, link: Link) => number;