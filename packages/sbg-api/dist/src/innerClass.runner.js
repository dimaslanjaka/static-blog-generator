'use strict';

class classX {
    constructor() {
        this.y = 0;
        this.utilities = new (class {
            constructor(superThis) {
                this.superThis = superThis;
            }
            testSetOuterPrivate(target) {
                this.superThis.y = target;
            }
        })(this);
    }
    getY() {
        return this.y;
    }
}
const x1 = new classX();
console.log(x1.getY());
x1.utilities.testSetOuterPrivate(4);
console.log(x1.getY());
