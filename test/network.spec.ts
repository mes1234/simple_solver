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
        vertexIn.SetValue(100);
        vertexOut.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;


        const link1 = new Link(vertexIn, vertexMid);
        const link2 = new Link(vertexMid, vertexOut);

        link1.SetValue(10);

        const intensiveFunc = (upstream: number, downstream: number, extensive: number): number => {

            return upstream - downstream;
        }

        const extensiveFunc = (upstream: number, downstream: number): number => {
            return (upstream - downstream) / 100.0;
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