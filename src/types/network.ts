import { Link } from "./link";
import { Vertex } from "./vertex";

export class Network {
    private _vertices: Vertex[] = [];
    private _links: Link[] = [];

    public Epsilon: number = 0.001;
    public Iterations: number = 0;

    public AddVertex(vertex: Vertex) {
        this._vertices.push(vertex);
        vertex.Epsilon = this.Epsilon;
    }

    public AddLink(link: Link) {
        this._links.push(link);
    }

    public Calculate() {
        let keepGoing = true;

        this.Iterations = 0;

        while (keepGoing) {
            // Calculate the links
            this._links.forEach(link => { link.Calculate(); });

            // Assign new values
            this._vertices.forEach(vertex => { vertex.Adjust(); })

            // Check balance
            keepGoing = !this._vertices.every(vertex => vertex.IsBalanced);

            this.Iterations++;
        }
    }

    public get VerticesStatus(): string {
        return this._vertices.map(vertex => vertex.Value.toString()).join(', ');
    }

    public get LinksStatus(): string {
        return this._links.map(vertex => vertex.Value.toString()).join(', ');
    }
}
