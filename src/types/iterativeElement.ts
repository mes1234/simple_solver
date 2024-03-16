export abstract class IterativeElement {

    public Value: number = 0;

    public Name: string = "undefined"

    constructor(public name: string, public value: number) {
        this.Value = value;
        this.Name = name;
    }
}