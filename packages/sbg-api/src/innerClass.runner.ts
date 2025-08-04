class classX {
  private y = 0;

  public getY(): number {
    return this.y;
  }

  public utilities = new (class {
    constructor(public superThis: classX) {}
    public testSetOuterPrivate(target: number) {
      this.superThis.y = target;
    }
  })(this);
}

const x1: classX = new classX();
console.log(x1.getY());

x1.utilities.testSetOuterPrivate(4);
console.log(x1.getY());
