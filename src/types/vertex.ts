import { ValueStabilityAnalyzer } from "./ValueStabilityAnalyzer";
import { VertexType } from "./VertexType";
import { IterativeElement } from "./iterativeElement";
import { Link } from "./link";

export class Vertex extends IterativeElement {

    Type: VertexType = VertexType.Intermediate;

    public Epsilon: number = 0.0001;

    private _valueStabilityAnalyzer = new ValueStabilityAnalyzer(5);

    private _stabilityAdjustment: number = 1;

    constructor(name: string, value: number) {
        super(name, value);
    }

    public AttachUpstreamLink(link: Link) {
        this._Inboundlinks.push(link);
    }

    public AttachDownstreamLink(link: Link) {
        this._Outboundlinks.push(link);
    }

    private _Inboundlinks: Link[] = [];
    private _Outboundlinks: Link[] = [];

    public get Balance(): number {
        return this.InboundFlow - this.OutboundFlow;
    }

    public get InboundFlow(): number {
        return this._Inboundlinks.reduce((sum, link) => sum + link.Value, 0);
    }

    public get OutboundFlow(): number {
        return this._Outboundlinks.reduce((sum, link) => sum + link.Value, 0);
    }

    public get IsBalanced(): boolean {
        // Source and sink vertices are assumed always balanced
        if (this.Type != VertexType.Intermediate) return true;

        return Math.abs(this.Balance) < this.Epsilon;
    }

    public get AdjustmentFactor(): number {
        // Source and sink vertices are assumed always balanced
        if (this.Type != VertexType.Intermediate) return 0;

        var adjustmentFactor = this.Balance / (Math.abs(this.InboundFlow) + Math.abs(this.OutboundFlow));

        if (adjustmentFactor >= 1) return 0.99;
        if (adjustmentFactor <= -1) return -0.99;

        return adjustmentFactor;
    }

    public CalculateStabilityAdjustment(): void {
        if (this._valueStabilityAnalyzer.isFluctuating()) {
            this._stabilityAdjustment = this._stabilityAdjustment - 0.1;
        }
        else {
            this._stabilityAdjustment = this._stabilityAdjustment + 0.1;
        }

        if (this._stabilityAdjustment > 1) this._stabilityAdjustment = 1;

        if (this._stabilityAdjustment < 0.1) this._stabilityAdjustment = 0.1;

    }

    public Adjust(): void {
        if (this.Type != VertexType.Intermediate) return;

        // Don't adjust if this vertext is already balanced
        // and speed it up for next iterations if needed
        if (this.IsBalanced) {
            this._stabilityAdjustment = 1;
            return
        }

        this.CalculateStabilityAdjustment();

        this.Value = this.Value + this.Value * this.AdjustmentFactor * this._stabilityAdjustment;

        // Prevent negative values and stop iterations
        if (this.Value <= 0) this.Value = 0.0001;

        this._valueStabilityAnalyzer.write(this.Value);
    }

    public get Description(): string {
        return `Vertex ${this.Name} with value ${this.Value}`;
    }
}


