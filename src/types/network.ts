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
            // Calculate the links
            this._links.forEach(link => { link.Calculate(); })

            // Assign new values
            // TODO this is wrong, there should be some adjustment added here based on balance
            this._vertices.forEach(vertex => { vertex.Flip(); })
            this._links.forEach(link => { link.Flip(); })

            // Check balance
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
