import { IterativeElement } from "./iterativeElement";
import { Vertex } from "./vertex";

export class Link extends IterativeElement {
    [x: string]: any;

    private _size = 1.0;

    constructor(private _upstreamVertex: Vertex, private _downstreamVertex: Vertex, value?: number) {

        super(value);

        this._upstreamVertex.AttachDownstreamLink(this);

        this._downstreamVertex.AttachDownstreamLink(this);
    }

    // Function to estimate downstream vertex value
    private intensiveFunct?: (intensivenumberpstream: number, intensiveDownstream: number, extensive: number) => number

    // Function to estimate flow value
    private extensiveFunct?: (intensivenumberpstream: number, intensiveDownstream: number) => number

    public AddIntensiveFunction(f: (intensivenumberpstream: number, intensiveDownstream: number, extensive: number) => number) {
        this.intensiveFunct = f;
    }

    public AddExtensiveFunctions(f: (intensivenumberpstream: number, intensiveDownstream: number) => number) {
        this.extensiveFunct = f;
    }

    public Calculate() {
        if (this.intensiveFunct) {
            this._downstreamVertex.SetValue(this.intensiveFunct!(this._upstreamVertex.GetValue(), this._downstreamVertex.GetValue(), this.GetValue()));
        }
        if (this.extensiveFunct) {
            this.SetValue(this.extensiveFunct(this._upstreamVertex.GetValue(), this._downstreamVertex.GetValue()));
        }
    }
}
