
import { Vertex } from "../src/types/vertex";
import { Link } from "../src/types/link";
import { expect } from "chai";
import { VertexType } from "../src/types/VertexType";

describe("Vertex", () => {
    it("should create a new vertes", () => {
        const vertex = new Vertex("V1", 0);

        expect(vertex).to.be.instanceOf(Vertex);
    })
});


describe("Link", () => {
    it("should create a two vericies and link", () => {
        const vertex1 = new Vertex("v1", 0);
        const vertex2 = new Vertex("v2", 0);

        vertex1.Type = VertexType.Source;
        vertex2.Type = VertexType.Sink;

        const link = new Link("l1", vertex1, vertex2, 0);

        expect(link).to.be.instanceOf(Link);

        expect(vertex1.Balance).to.equal(0);
    })
});