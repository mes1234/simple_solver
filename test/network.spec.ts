import { expect } from "chai";
import { MassFlow } from "../src/preconfigured/massflow";
import { Pressure } from "../src/preconfigured/pressure";
import { Link } from "../src/types/link";
import { Vertex, VertexType } from "../src/types/vertex";
import { Network } from "../src/types/network";


describe("Network", () => {
    it("should create simple network and iterate", () => {
        const vertexIn = new Vertex(Pressure, MassFlow);
        const vertexOut = new Vertex(Pressure, MassFlow);
        const vertexMid = new Vertex(Pressure, MassFlow);

        vertexIn.Type = VertexType.Source;
        vertexIn.Value.amount = 100;
        vertexOut.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;

        const link1 = new Link(MassFlow, vertexIn, vertexMid);
        const link2 = new Link(MassFlow, vertexMid, vertexOut);

        link1.Value.amount = 10;

        const intensiveFunc = (upstream: Pressure, downstream: Pressure, extensive: MassFlow): Pressure => {
            const p = new Pressure();

            p.amount = upstream.amount - downstream.amount;

            return p;
        }

        const extensiveFunc = (upstream: Pressure, downstream: Pressure): MassFlow => {
            const p = new MassFlow();

            p.amount = (upstream.amount - downstream.amount) / 100.0;

            return p;
        }

        link1.AddIntensiveFunction(intensiveFunc);
        link1.AddExtensiveFunctions(extensiveFunc);

        link2.AddIntensiveFunction(intensiveFunc);
        link2.AddExtensiveFunctions(extensiveFunc);

        const network = new Network()

        network.AddVertex(vertexIn);
        network.AddVertex(vertexOut);
        network.AddVertex(vertexMid);
        network.AddLink(link1);
        network.AddLink(link2);

        network.Calculate();

    })
});