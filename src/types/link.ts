import { IterativeElement } from "./iterativeElement";
import { Vertex } from "./vertex";

export class Link extends IterativeElement {

    private _dh = 1.0;
    private _L = 1.0;

    constructor(private _upstreamVertex: Vertex, private _downstreamVertex: Vertex, value: number) {

        super(value);

        this._upstreamVertex.AttachUpstreamLink(this);

        this._downstreamVertex.AttachDownstreamLink(this);
    }

    // Function to estimate downstream vertex value
    private intensiveFunct?: (intensivenumberpstream: number, extensive: number, dh: number, L: number) => number

    // Function to estimate flow value
    private extensiveFunct?: (intensivenumberpstream: number, intensiveDownstream: number, dh: number, L: number) => number

    public AddIntensiveFunction(f: (intensivenumberpstream: number, extensive: number, dh: number, L: number) => number) {
        this.intensiveFunct = f;
    }

    public AddExtensiveFunctions(f: (intensivenumberpstream: number, intensiveDownstream: number, dh: number, L: number) => number) {
        this.extensiveFunct = f;
    }

    public Calculate() {
        if (this.intensiveFunct &&
            this._downstreamVertex.Type != "Sink" &&
            this._downstreamVertex.Type != "Source") {
            this._downstreamVertex.SetValue(this.intensiveFunct!(this._upstreamVertex.GetValue(), this.GetValue(), this._dh, this._L));
        }
        if (this.extensiveFunct) {
            this.SetValue(this.extensiveFunct(this._upstreamVertex.GetValue(), this._downstreamVertex.GetValue(), this._dh, this._L));
        }
    }
}
