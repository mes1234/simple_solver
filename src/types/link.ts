import { ExtensiveFunc, IntensiveFunc, IterativeElement } from "./iterativeElement";
import { Vertex } from "./vertex";

export class Link extends IterativeElement {

    dh = 1.0;
    L = 1.0;

    constructor(private _upstreamVertex: Vertex, private _downstreamVertex: Vertex, value: number) {

        super(value);

        this._upstreamVertex.AttachUpstreamLink(this);

        this._downstreamVertex.AttachDownstreamLink(this);
    }

    // Function to estimate downstream vertex value
    private intensiveFunct?: IntensiveFunc;

    // Function to estimate flow value
    private extensiveFunct?: ExtensiveFunc;

    public AddIntensiveFunction(f: IntensiveFunc) {
        this.intensiveFunct = f;
    }

    public AddExtensiveFunctions(f: ExtensiveFunc) {
        this.extensiveFunct = f;
    }

    public Calculate() {
        if (this.intensiveFunct &&
            this._downstreamVertex.Type != "Sink" &&
            this._downstreamVertex.Type != "Source") {
            this._downstreamVertex.SetValue(this.intensiveFunct!(this._upstreamVertex, this));
        }
        if (this.extensiveFunct) {
            this.SetValue(this.extensiveFunct(this._upstreamVertex, this._downstreamVertex, this));
        }
    }
}
