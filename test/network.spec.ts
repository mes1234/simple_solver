import { Link } from "../src/types/link";
import { Vertex } from "../src/types/vertex";
import { Network } from "../src/types/network";
import { ElementType } from "../src/types/iterativeElement";
import { ExtensiveFunc } from "../src/types/iterativeElement";
import { IntensiveFunc } from "../src/types/iterativeElement";


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

        const intensiveFunc: IntensiveFunc = (upstream: Vertex, extensive: Link): number => {

            const crossSection = Math.PI * Math.pow(extensive.dh, 2) / 4;

            const downstream = upstream.GetValue() - fd * extensive.L * rho / 2 * extensive.GetValue() * extensive.GetValue() / extensive.dh / crossSection;

            return Math.max(downstream, 0);
        }

        const extensiveFunc: ExtensiveFunc = (upstream: Vertex, downstream: Vertex, extensive: Link): number => {

            const crossSection = Math.PI * Math.pow(extensive.dh, 2) / 4;

            const result = (upstream.GetValue() > downstream.GetValue())
                ? crossSection * Math.sqrt(2 * (upstream.GetValue() - downstream.GetValue()) / rho / extensive.L / fd * extensive.dh)
                : -crossSection * Math.sqrt(2 * (downstream.GetValue() - upstream.GetValue()) / rho / extensive.L / fd * extensive.dh);

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