import { MassFlow } from "../src/preconfigured/massflow"
import { Pressure } from "../src/preconfigured/pressure";
import { Vertex, VertexType } from "../src/types/vertex";
import { Link } from "../src/types/link";
import { expect } from "chai";

describe("Vertex", () => {
    it("should create a new vertes", () => {
        const vertex = new Vertex(Pressure, MassFlow);

        expect(vertex).to.be.instanceOf(Vertex);
    })
});


describe("Network", () => {
    it("should create a two vericies and link", () => {
        const vertex1 = new Vertex(Pressure, MassFlow);
        const vertex2 = new Vertex(Pressure, MassFlow);

        vertex1.Type = VertexType.Source;
        vertex2.Type = VertexType.Sink;

        const link = new Link(MassFlow, vertex1, vertex2);

        expect(link).to.be.instanceOf(Link);

        expect(vertex1.Balance.amount).to.equal(0);
    })
});