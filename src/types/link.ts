import { ExtensiveQuantity } from "./extensiveQuantity";
import { IntensiveQuantity } from "./intensiveQuantity";
import { Vertex } from "./vertex";


export class Link<T extends IntensiveQuantity, U extends ExtensiveQuantity> {
    private _value: U;

    private _size = 1.0;

    constructor(type: { new(): U }, upstreamVertex: Vertex<T, U>, downstreamVertex: Vertex<T, U>) {

        this._value = new type();

        this.upstreamVertex = upstreamVertex;

        this.upstreamVertex.AttachDownstreamLink(this);

        this.downstreamVertex = downstreamVertex;

        this.downstreamVertex.AttachUpstreamLink(this);
    }

    private upstreamVertex: Vertex<T, U>;
    private downstreamVertex: Vertex<T, U>;
    private intensiveFunct?: (intensiveUpstream: T, intensiveDownstream: T, extensive: U) => T
    private extensiveFunct?: (intensiveUpstream: T, intensiveDownstream: T) => U

    public AddIntensiveFunction(f: (intensiveUpstream: T, intensiveDownstream: T, extensive: U) => T) {
        this.intensiveFunct = f;
    }


    public AddExtensiveFunctions(f: (intensiveUpstream: T, intensiveDownstream: T) => U) {
        this.extensiveFunct = f;
    }

    public Calculate() {
        if (this.intensiveFunct) {
            this.downstreamVertex.Value = this.intensiveFunct!(this.upstreamVertex.Value, this.downstreamVertex.Value, this._value);
        }
    }

    public get Value(): U {
        if (this.extensiveFunct) {
            this._value = this.extensiveFunct!(this.upstreamVertex.Value, this.downstreamVertex.Value)
        }
        return this._value;
    }
}
