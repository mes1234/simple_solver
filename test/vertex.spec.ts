
import { Vertex, VertexType } from "../src/types/vertex";
import { Link } from "../src/types/link";
import { expect } from "chai";

describe("Vertex", () => {
    it("should create a new vertes", () => {
        const vertex = new Vertex();

        expect(vertex).to.be.instanceOf(Vertex);
    })
});


describe("Link", () => {
    it("should create a two vericies and link", () => {
        const vertex1 = new Vertex();
        const vertex2 = new Vertex();

        vertex1.Type = VertexType.Source;
        vertex2.Type = VertexType.Sink;

        const link = new Link(vertex1, vertex2);

        expect(link).to.be.instanceOf(Link);

        expect(vertex1.Balance).to.equal(0);
    })
});