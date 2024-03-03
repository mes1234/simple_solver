import { Vertex } from "./vertex";

export class Link {
    private _flow: number = 0.0;

    private _size = 1.0;

    constructor(private _upstreamVertex: Vertex, private _downstreamVertex: Vertex) {

        this._upstreamVertex.AttachDownstreamLink(this);

        this._downstreamVertex.AttachDownstreamLink(this);
    }
    private intensiveFunct?: (intensivenumberpstream: number, intensiveDownstream: number, extensive: number) => number
    private extensiveFunct?: (intensivenumberpstream: number, intensiveDownstream: number) => number

    public AddIntensiveFunction(f: (intensivenumberpstream: number, intensiveDownstream: number, extensive: number) => number) {
        this.intensiveFunct = f;
    }

    public AddExtensiveFunctions(f: (intensivenumberpstream: number, intensiveDownstream: number) => number) {
        this.extensiveFunct = f;
    }

    public Calculate() {
        if (this.intensiveFunct) {
            this._downstreamVertex.Value = this.intensiveFunct!(this._upstreamVertex.Value, this._downstreamVertex.Value, this._flow);
        }
    }

    public get Value(): number {
        if (this.extensiveFunct) {
            this._flow = this.extensiveFunct!(this._upstreamVertex.Value, this._downstreamVertex.Value)
        }
        return this._flow;
    }

    public set Value(value: number) {
        this._flow = value;
    }
}
