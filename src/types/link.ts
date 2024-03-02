import { ExtensiveQuantity } from "./extensiveQuantity";
import { IntensiveQuantity } from "./intensiveQuantity";
import { Vertex } from "./vertex";


export class Link<T extends IntensiveQuantity, U extends ExtensiveQuantity> {
    private _value: U;

    constructor(type: { new(): U }, upstreamVertex: Vertex<T, U>, downstreamVertex: Vertex<T, U>) {

        this._value = new type();

        this.upstreamVertex = upstreamVertex;

        this.upstreamVertex.AttachDownstreamLink(this);

        this.downstreamVertex = downstreamVertex;

        this.downstreamVertex.AttachUpstreamLink(this);
    }

    private upstreamVertex: Vertex<T, U>;
    private downstreamVertex: Vertex<T, U>;
    private func?: (intensiveUpstream: T, intensiveDownstream: T, extensive: U) => T

    public AddFunction(f: (intensiveUpstream: T, intensiveDownstream: T, extensive: U) => T) {
        this.func = f;
    }

    public Calculate() {
        if (this.func) {
            this.downstreamVertex.Value = this.func(this.upstreamVertex.Value, this.downstreamVertex.Value, this._value);
        }
    }
}
