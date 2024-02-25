import { ExtensiveQuantity } from "./extensiveQuantity";
import { IntensiveQuantity } from "./intensiveQuantity";
import { Vertex } from "./vertex";


export class Link<T extends IntensiveQuantity, U extends ExtensiveQuantity> {
    private _value: T;

    constructor(type: { new(): T }, upstreamVertex: Vertex<T, U>, downstreamVertex: Vertex<T, U>) {

        this._value = new type();

        this.upstreamVertex = upstreamVertex;

        this.upstreamVertex.AttachDownstreamLink(this);

        this.downstreamVertex = downstreamVertex;

        this.downstreamVertex.AttachUpstreamLink(this);
    }

    public get Value(): T {
        return this._value;
    }

    private upstreamVertex: Vertex<T, U>;
    private downstreamVertex: Vertex<T, U>;

}
