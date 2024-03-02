import { ExtensiveQuantity } from "./extensiveQuantity";
import { IntensiveQuantity } from "./intensiveQuantity";
import { Link } from "./link";
import { Vertex } from "./vertex";

export class Network<T extends IntensiveQuantity, U extends ExtensiveQuantity>  {
    private _vertices: Vertex<T, U>[] = [];
    private _links: Link<T, U>[] = [];

    public AddVertex(vertex: Vertex<T, U>) {
        this._vertices.push(vertex);
    }

    public AddLink(link: Link<T, U>) {
        this._links.push(link);
    }

    public Calculate() {
        this._vertices.forEach(v => v.Balance);
    }

}
