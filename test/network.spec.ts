import { Link, LinkFunction } from "../src/types/link";
import { Vertex } from "../src/types/vertex";
import { Network } from "../src/types/network";
import { expect } from "chai";
import { VertexType } from "../src/types/VertexType";


describe("Network Tests", () => {
    it("should create simple network and iterate", () => {
        const vertexIn = new Vertex("Vin", 10);
        const vertexOut = new Vertex("Vout", 0);
        const vertexMid = new Vertex("Vmid", 1);

        vertexIn.Type = VertexType.Source;
        vertexOut.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;

        const rho = 1000;
        const fd = 0.02;



        const link1 = new Link("Link #1", vertexIn, vertexMid, 10);
        const link2 = new Link("Link #2", vertexMid, vertexOut, -1);


        const func: LinkFunction = (upstream: Vertex, downstream: Vertex, extensive: Link): number => {

            const crossSection = Math.PI * Math.pow(extensive.dh, 2) / 4;

            const result = (upstream.Value > downstream.Value)
                ? crossSection * Math.sqrt(2 * (upstream.Value - downstream.Value) / rho / extensive.L / fd * extensive.dh)
                : -crossSection * Math.sqrt(2 * (downstream.Value - upstream.Value) / rho / extensive.L / fd * extensive.dh);

            return result;
        }

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
        expect(vertexMid.Value).to.approximately(5, 0.01);
        expect(vertexOut.Value).to.approximately(0, 0.01);

        expect(network.Iterations).to.lte(20);

        expect(vertexIn.Balance).to.approximately(-0.56, 0.01);
        expect(vertexMid.Balance).to.approximately(0, network.Epsilon);
        expect(vertexOut.Balance).to.approximately(0.56, 0.01);

        expect(link1.Value).to.approximately(0.56, 0.01);
        expect(link2.Value).to.approximately(0.56, 0.01);

    })

    it("should create simple backflow network and iterate", () => {
        const vertexIn = new Vertex("Vin", 10);
        const vertexOut = new Vertex("Vout", 11);
        const vertexMid = new Vertex("Vmid", 1);

        vertexIn.Type = VertexType.Source;
        vertexOut.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;

        const rho = 1000;
        const fd = 0.02;



        const link1 = new Link("Link #1", vertexIn, vertexMid, 10);
        const link2 = new Link("Link #2", vertexMid, vertexOut, -1);


        const func: LinkFunction = (upstream: Vertex, downstream: Vertex, extensive: Link): number => {

            const crossSection = Math.PI * Math.pow(extensive.dh, 2) / 4;

            const result = (upstream.Value > downstream.Value)
                ? crossSection * Math.sqrt(2 * (upstream.Value - downstream.Value) / rho / extensive.L / fd * extensive.dh)
                : -crossSection * Math.sqrt(2 * (downstream.Value - upstream.Value) / rho / extensive.L / fd * extensive.dh);

            return result;
        }

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


    it("should create simple diwering network and iterate", () => {
        const vertexIn = new Vertex("Vin", 10);
        const vertexOut1 = new Vertex("Vout1", 0);
        const vertexOut2 = new Vertex("Vout2", 0);
        const vertexMid = new Vertex("Vmid", 1);

        vertexIn.Type = VertexType.Source;
        vertexOut1.Type = VertexType.Sink;
        vertexOut2.Type = VertexType.Sink;
        vertexMid.Type = VertexType.Intermediate;

        const rho = 1000;
        const fd = 0.02;



        const link1 = new Link("Link #1", vertexIn, vertexMid, 10);
        const link2 = new Link("Link #2", vertexMid, vertexOut1, 1);
        const link3 = new Link("Link #3", vertexMid, vertexOut2, 5);

        link1.L = 10;
        link2.L = 10;
        link3.L = 10;
        link1.dh = 1.0;
        link2.dh = 1.0 / Math.sqrt(2);
        link3.dh = 1.0 / Math.sqrt(2);


        const func: LinkFunction = (upstream: Vertex, downstream: Vertex, extensive: Link): number => {

            const crossSection = Math.PI * Math.pow(extensive.dh, 2) / 4;

            const result = (upstream.Value > downstream.Value)
                ? crossSection * Math.sqrt(2 * (upstream.Value - downstream.Value) / rho / extensive.L / fd * extensive.dh)
                : -crossSection * Math.sqrt(2 * (downstream.Value - upstream.Value) / rho / extensive.L / fd * extensive.dh);

            return result;
        }

        link1.AddFunc(func);
        link2.AddFunc(func);
        link3.AddFunc(func);

        const network = new Network()

        network.Epsilon = 0.00001;

        network.AddVertex(vertexIn);
        network.AddVertex(vertexMid);
        network.AddVertex(vertexOut1);
        network.AddVertex(vertexOut2);
        network.AddLink(link1);
        network.AddLink(link2);
        network.AddLink(link3);

        network.Calculate();

        expect(vertexIn.Value).to.approximately(10, 0.01);
        expect(vertexMid.Value).to.approximately(5.85, 0.01); // TODO check if this is correct (Excel)
        expect(vertexOut1.Value).to.approximately(0, 0.01);
        expect(vertexOut2.Value).to.approximately(0, 0.01);

        expect(network.Iterations).to.lte(35);

        // expect(vertexIn.Balance).to.approximately(0.18, 0.01);
        // expect(vertexMid.Balance).to.approximately(0, network.Epsilon);
        // expect(vertexOut.Balance).to.approximately(-0.18, 0.01);

        expect(link1.Value).to.approximately(link2.Value + link3.Value, 0.01);
        expect(link2.Value).to.approximately(0.08, 0.01); // TODO check if this is correct (Excel)

    })
});