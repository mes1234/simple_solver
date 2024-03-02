import { ExtensiveQuantity } from "./extensiveQuantity";
import { IntensiveQuantity } from "./intensiveQuantity";
import { Link } from "./link";
import { Vertex } from "./vertex";

export class Network<T extends IntensiveQuantity, U extends ExtensiveQuantity>  {
    private _vertices: Vertex<T, U>[] = [];
    private _links: Link<T, U>[] = [];
    private _epsilon: number = 0.0001;

    public AddVertex(vertex: Vertex<T, U>) {
        this._vertices.push(vertex);
    }

    public AddLink(link: Link<T, U>) {
        this._links.push(link);
    }

    public Calculate() {
        let keepGoing = true;

        while (keepGoing) {
            this._vertices.forEach(vertex => { vertex.Adjust(); })
            this._links.forEach(link => { link.Calculate(); })
            keepGoing = this._vertices.some(vertex => !vertex.IsBalanced);

        }
    }
}
