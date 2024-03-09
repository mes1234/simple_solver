import { expect } from "chai";
import { Link } from "../src/types/link";
import { Vertex, VertexType } from "../src/types/vertex";
import { Network } from "../src/types/network";


describe("Network", () => {
    it("should create simple network and iterate", () => {
        const vertexIn = new Vertex();
        const vertexOut = new Vertex();
        const vertexMid = new Vertex();

        vertexIn.Type = VertexType.Source;
        vertexIn.SetValue(10);
        vertexOut.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;


        const link1 = new Link(vertexIn, vertexMid);
        link1.SetValue(-1.01);
        const link2 = new Link(vertexMid, vertexOut);
        link1.SetValue(0.02);

        const intensiveFunc = (upstream: number, extensive: number): number => {
            const result = upstream - extensive * extensive * 1000 / 2

            return result;
        }

        const extensiveFunc = (upstream: number, downstream: number): number => {
            const result = Math.sqrt(2 * (upstream - downstream) / 1000.0);

            return result;
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