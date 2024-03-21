import { Link, LinkFunction } from "../src/types/link";
import { Vertex } from "../src/types/vertex";
import { Network } from "../src/types/network";
import { expect } from "chai";
import { VertexType } from "../src/types/VertexType";

const rho = 1000;
const fd = 0.02;

const flow10to0 = 0.56;
const convergeEpsilon = 0.01;
const pUp = 10;
const pDown = 0;

const func: LinkFunction = (upstream: Vertex, downstream: Vertex, extensive: Link): number => {

    const crossSection = Math.PI * Math.pow(extensive.dh, 2) / 4;

    const result = (upstream.Value > downstream.Value)
        ? crossSection * Math.sqrt(2 * (upstream.Value - downstream.Value) / rho / extensive.L / fd * extensive.dh)
        : -crossSection * Math.sqrt(2 * (downstream.Value - upstream.Value) / rho / extensive.L / fd * extensive.dh);

    return result;
}


describe("Network Tests", () => {
    it("should create simple network and iterate", () => {
        const vertexIn = new Vertex("Vin", pUp);
        const vertexOut = new Vertex("Vout", pDown);
        const vertexMid = new Vertex("Vmid", 1);

        vertexIn.Type = VertexType.Source;
        vertexOut.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;

        const link1 = new Link("Link #1", vertexIn, vertexMid, 33);
        const link2 = new Link("Link #2", vertexMid, vertexOut, -1);

        link1.AddFunc(func);

        link2.AddFunc(func);

        const network = new Network()

        network.Epsilon = 0.001;

        network.AddVertex(vertexIn);
        network.AddVertex(vertexMid);
        network.AddVertex(vertexOut);
        network.AddLink(link1);
        network.AddLink(link2);

        network.Calculate();

        expect(vertexIn.Value).to.approximately(pUp, convergeEpsilon);
        expect(vertexMid.Value).to.approximately((pUp + pDown) / 2, convergeEpsilon);
        expect(vertexOut.Value).to.approximately(pDown, convergeEpsilon);

        expect(network.Iterations).to.lte(20);

        expect(vertexIn.Balance).to.approximately(-flow10to0, convergeEpsilon);
        expect(vertexMid.Balance).to.approximately(0, network.Epsilon);
        expect(vertexOut.Balance).to.approximately(flow10to0, convergeEpsilon);

        expect(link1.Value).to.approximately(flow10to0, convergeEpsilon);
        expect(link2.Value).to.approximately(flow10to0, convergeEpsilon);

    })

    it("should create simple backflow network and iterate", () => {
        const vertexIn = new Vertex("Vin", 10);
        const vertexOut = new Vertex("Vout", 11);
        const vertexMid = new Vertex("Vmid", 1);

        vertexIn.Type = VertexType.Source;
        vertexOut.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;

        const link1 = new Link("Link #1", vertexIn, vertexMid, 10);
        const link2 = new Link("Link #2", vertexMid, vertexOut, -1);

        link1.AddFunc(func);
        link2.AddFunc(func);

        const network = new Network()

        network.Epsilon = 0.001;

        network.AddVertex(vertexIn);
        network.AddVertex(vertexMid);
        network.AddVertex(vertexOut);
        network.AddLink(link1);
        network.AddLink(link2);

        network.Calculate();

        expect(vertexIn.Value).to.approximately(10, 0.01);
        expect(vertexMid.Value).to.approximately(10.5, 0.01);
        expect(vertexOut.Value).to.approximately(11, 0.01);

        expect(network.Iterations).to.lte(35);

        expect(vertexIn.Balance).to.approximately(0.18, 0.01);
        expect(vertexMid.Balance).to.approximately(0, network.Epsilon);
        expect(vertexOut.Balance).to.approximately(-0.18, 0.01);

        expect(link1.Value).to.approximately(-0.18, 0.01);
        expect(link2.Value).to.approximately(-0.18, 0.01);

    })


    it("should create simple divering network and iterate", () => {
        const vertexIn1 = new Vertex("Vin1", pUp);
        const vertexIn2 = new Vertex("Vin2", pUp);
        const vertexOut1 = new Vertex("Vout1", pDown);
        const vertexOut2 = new Vertex("Vout2", pDown);
        const vertexMid = new Vertex("Vmid", 7);

        vertexIn1.Type = VertexType.Source;
        vertexIn2.Type = VertexType.Source;
        vertexOut1.Type = VertexType.Sink;
        vertexOut2.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;

        const link1 = new Link("Link #1", vertexIn1, vertexMid, 4);
        const link2 = new Link("Link #1", vertexIn2, vertexMid, 3);
        const link3 = new Link("Link #2", vertexMid, vertexOut1, 1);
        const link4 = new Link("Link #3", vertexMid, vertexOut2, 3);


        link1.AddFunc(func);
        link2.AddFunc(func);
        link3.AddFunc(func);
        link4.AddFunc(func);

        const network = new Network()

        network.Epsilon = 0.00001;

        network.AddVertex(vertexIn1);
        network.AddVertex(vertexIn2);
        network.AddVertex(vertexMid);
        network.AddVertex(vertexOut1);
        network.AddVertex(vertexOut2);
        network.AddLink(link1);
        network.AddLink(link2);
        network.AddLink(link3);
        network.AddLink(link4);

        network.Calculate();

        expect(vertexIn1.Value).to.approximately(pUp, convergeEpsilon);
        expect(vertexIn2.Value).to.approximately(pUp, convergeEpsilon);
        expect(vertexMid.Value).to.approximately((pUp + pDown) / 2, convergeEpsilon);
        expect(vertexOut1.Value).to.approximately(pDown, convergeEpsilon);
        expect(vertexOut2.Value).to.approximately(pDown, convergeEpsilon);

        expect(network.Iterations).to.lte(35);

        expect(vertexIn1.Balance).to.approximately(-flow10to0, convergeEpsilon);
        expect(vertexIn2.Balance).to.approximately(-flow10to0, convergeEpsilon);
        expect(vertexMid.Balance).to.approximately(0, network.Epsilon);
        expect(vertexOut1.Balance).to.approximately(flow10to0, convergeEpsilon);
        expect(vertexOut1.Balance).to.approximately(flow10to0, convergeEpsilon);

        expect(link1.Value).to.approximately(flow10to0, convergeEpsilon);
        expect(link2.Value).to.approximately(flow10to0, convergeEpsilon);
        expect(link3.Value).to.approximately(flow10to0, convergeEpsilon);
        expect(link4.Value).to.approximately(flow10to0, convergeEpsilon);

    })


    it("long single pipe network divering network and iterate", () => {
        const vertexIn = new Vertex("Vin", pUp);
        const vertexOut = new Vertex("Vout", pDown);
        const vertexMid1 = new Vertex("Vmid1", 7);
        const vertexMid2 = new Vertex("Vmid2", 6);
        const vertexMid3 = new Vertex("Vmid2", 8);

        vertexIn.Type = VertexType.Source;
        vertexOut.Type = VertexType.Sink;
        vertexMid1.Type = VertexType.Intermediate;
        vertexMid2.Type = VertexType.Intermediate;
        vertexMid3.Type = VertexType.Intermediate;

        const link1 = new Link("Link #1", vertexIn, vertexMid1, 1);
        const link2 = new Link("Link #2", vertexMid1, vertexMid2, 1);
        const link3 = new Link("Link #3", vertexMid2, vertexMid3, 1);
        const link4 = new Link("Link #4", vertexMid3, vertexOut, 1);


        link1.AddFunc(func);
        link2.AddFunc(func);
        link3.AddFunc(func);
        link4.AddFunc(func);

        const network = new Network()

        network.Epsilon = 0.01;

        network.AddVertex(vertexIn);
        network.AddVertex(vertexOut);
        network.AddVertex(vertexMid1);
        network.AddVertex(vertexMid2);
        network.AddVertex(vertexMid3);
        network.AddLink(link1);
        network.AddLink(link2);
        network.AddLink(link3);
        network.AddLink(link4);

        network.Calculate();

        expect(vertexMid1.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid2.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid3.Balance).to.approximately(0, network.Epsilon);

    })


    it("very long single pipe network divering network and iterate", () => {
        const vertexIn = new Vertex("Vin", pUp);
        const vertexOut = new Vertex("Vout", pDown);
        const vertexMid1 = new Vertex("Vmid1", 7);
        const vertexMid2 = new Vertex("Vmid2", 6);
        const vertexMid3 = new Vertex("Vmid3", 8);
        const vertexMid4 = new Vertex("Vmid4", 0);

        vertexIn.Type = VertexType.Source;
        vertexOut.Type = VertexType.Sink;
        vertexMid1.Type = VertexType.Intermediate;
        vertexMid2.Type = VertexType.Intermediate;
        vertexMid3.Type = VertexType.Intermediate;
        vertexMid4.Type = VertexType.Intermediate;

        const link1 = new Link("Link #1", vertexIn, vertexMid1, 1);
        const link2 = new Link("Link #2", vertexMid1, vertexMid2, 1);
        const link3 = new Link("Link #3", vertexMid2, vertexMid3, 1);
        const link4 = new Link("Link #3", vertexMid3, vertexMid4, 1);
        const link5 = new Link("Link #4", vertexMid4, vertexOut, 1);


        link1.AddFunc(func);
        link2.AddFunc(func);
        link3.AddFunc(func);
        link4.AddFunc(func);
        link5.AddFunc(func);

        const network = new Network()

        network.Epsilon = 0.1;

        network.AddVertex(vertexIn);
        network.AddVertex(vertexOut);
        network.AddVertex(vertexMid1);
        network.AddVertex(vertexMid2);
        network.AddVertex(vertexMid3);
        network.AddVertex(vertexMid4);
        network.AddLink(link1);
        network.AddLink(link2);
        network.AddLink(link3);
        network.AddLink(link4);
        network.AddLink(link4);
        network.AddLink(link5);

        network.Calculate();

        expect(vertexMid1.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid2.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid3.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid4.Balance).to.approximately(0, network.Epsilon);

    })

    it("very very long single pipe network divering network and iterate", () => {
        const vertexIn = new Vertex("Vin", pUp);
        const vertexOut = new Vertex("Vout", pDown);
        const vertexMid1 = new Vertex("Vmid1", 7);
        const vertexMid2 = new Vertex("Vmid2", 6);
        const vertexMid3 = new Vertex("Vmid3", 4);
        const vertexMid4 = new Vertex("Vmid4", 4);
        const vertexMid5 = new Vertex("Vmid5", 3);

        vertexIn.Type = VertexType.Source;
        vertexOut.Type = VertexType.Sink;
        vertexMid1.Type = VertexType.Intermediate;
        vertexMid2.Type = VertexType.Intermediate;
        vertexMid3.Type = VertexType.Intermediate;
        vertexMid4.Type = VertexType.Intermediate;
        vertexMid5.Type = VertexType.Intermediate;

        const link1 = new Link("Link #1", vertexIn, vertexMid1, 1);
        const link2 = new Link("Link #2", vertexMid1, vertexMid2, 1);
        const link3 = new Link("Link #3", vertexMid2, vertexMid3, 1);
        const link4 = new Link("Link #4", vertexMid3, vertexMid4, 1);
        const link5 = new Link("Link #5", vertexMid4, vertexMid5, 1);
        const link6 = new Link("Link #6", vertexMid5, vertexOut, 1);


        link1.AddFunc(func);
        link2.AddFunc(func);
        link3.AddFunc(func);
        link4.AddFunc(func);
        link5.AddFunc(func);
        link6.AddFunc(func);

        const network = new Network()

        network.Epsilon = 0.05;

        network.AddVertex(vertexIn);
        network.AddVertex(vertexOut);
        network.AddVertex(vertexMid1);
        network.AddVertex(vertexMid2);
        network.AddVertex(vertexMid3);
        network.AddVertex(vertexMid4);
        network.AddVertex(vertexMid5);
        network.AddLink(link1);
        network.AddLink(link2);
        network.AddLink(link3);
        network.AddLink(link4);
        network.AddLink(link4);
        network.AddLink(link5);
        network.AddLink(link6);

        network.Calculate();

        expect(vertexMid1.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid2.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid3.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid4.Balance).to.approximately(0, network.Epsilon);
        expect(vertexMid5.Balance).to.approximately(0, network.Epsilon);

    })
});