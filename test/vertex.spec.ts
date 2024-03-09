
import { Vertex } from "../src/types/vertex";
import { Link } from "../src/types/link";
import { ElementType } from "../src/types/iterativeElement";
import { expect } from "chai";

describe("Vertex", () => {
    it("should create a new vertes", () => {
        const vertex = new Vertex(0);

        expect(vertex).to.be.instanceOf(Vertex);
    })
});


describe("Link", () => {
    it("should create a two vericies and link", () => {
        const vertex1 = new Vertex(0);
        const vertex2 = new Vertex(0);

        vertex1.Type = ElementType.Source;
        vertex2.Type = ElementType.Sink;

        const link = new Link(vertex1, vertex2, 0);

        expect(link).to.be.instanceOf(Link);

        expect(vertex1.Balance).to.equal(0);
    })
});