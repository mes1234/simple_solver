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
            // this._vertices.forEach(vertex => { vertex.Adjust(); })
            this._vertices.runInRandomOrder(vertex => { vertex.Adjust(); })

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

    public get VerticesBalance(): string {
        return this._vertices.map(vertex => vertex.IsBalanced.toString()).join(', ');
    }
}
declare global {
    interface Array<T> {
        runInRandomOrder(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    }
}

Array.prototype.runInRandomOrder = function <T>(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
    const randomIndices = generateUniqueRandomArray(this.length);
    randomIndices.forEach(x => callbackfn(this[x], x, this))
};

function generateUniqueRandomArray(n: number): number[] {
    // Create an array with numbers from 0 to n-1
    const initialArray: number[] = Array.from({ length: n }, (_, index) => index);

    // Shuffle the array
    for (let i = initialArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initialArray[i], initialArray[j]] = [initialArray[j], initialArray[i]];
    }

    // Return the first n elements
    return initialArray.slice(0, n);
}