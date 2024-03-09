import { Link } from "../src/types/link";
import { Vertex } from "../src/types/vertex";
import { Network } from "../src/types/network";
import { ElementType } from "../src/types/iterativeElement";


describe("Network", () => {
    it("should create simple network and iterate", () => {
        const vertexIn = new Vertex(10);
        const vertexOut = new Vertex(0.1);
        const vertexMid = new Vertex(1);

        vertexIn.Type = ElementType.Source;
        vertexOut.Type = ElementType.Sink;
        vertexMid.Type = ElementType.Intermediate;

        const rho = 1000;
        const fd = 0.02;



        const link1 = new Link(vertexIn, vertexMid, 6);
        const link2 = new Link(vertexMid, vertexOut, -6);

        const intensiveFunc = (upstream: number, extensive: number, dh: number, L: number): number => {

            const crossSection = Math.PI * Math.pow(dh, 2) / 4;

            const downstream = upstream - fd * L * rho / 2 * extensive * extensive / dh / crossSection;

            return Math.max(downstream, 0);
        }

        const extensiveFunc = (upstream: number, downstream: number, dh: number, L: number): number => {
            const crossSection = Math.PI * Math.pow(dh, 2) / 4;

            const result = (upstream > downstream)
                ? crossSection * Math.sqrt(2 * (upstream - downstream) / rho / L / fd * dh)
                : -crossSection * Math.sqrt(2 * (downstream - upstream) / rho / L / fd * dh);

            return result;
        }

        link1.AddIntensiveFunction(intensiveFunc);
        link1.AddExtensiveFunctions(extensiveFunc);

        link2.AddIntensiveFunction(intensiveFunc);
        link2.AddExtensiveFunctions(extensiveFunc);

        const network = new Network()

        network.AddVertex(vertexIn);
        network.AddVertex(vertexMid);
        network.AddVertex(vertexOut);
        network.AddLink(link1);
        network.AddLink(link2);

        network.Calculate();

    })
});