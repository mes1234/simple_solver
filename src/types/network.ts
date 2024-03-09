import { Link } from "./link";
import { Vertex } from "./vertex";

export class Network {
    private _vertices: Vertex[] = [];
    private _links: Link[] = [];
    private _epsilon: number = 0.0001;

    public AddVertex(vertex: Vertex) {
        this._vertices.push(vertex);
    }

    public AddLink(link: Link) {
        this._links.push(link);
    }

    public Calculate() {
        let keepGoing = true;

        while (keepGoing) {
            this._vertices.forEach(vertex => { vertex.Flip(); })
            this._links.forEach(link => { link.Flip(); })
            this._links.forEach(link => { link.Calculate(); })
            keepGoing = !this._vertices.every(vertex => vertex.IsBalanced);

        }
    }

    public get VerticesStatus(): string {
        return this._vertices.map(vertex => vertex.GetValue().toString()).join(', ');
    }

    public get LinksStatus(): string {
        return this._links.map(vertex => vertex.GetValue().toString()).join(', ');
    }
}
