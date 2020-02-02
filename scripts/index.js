class SpootApp {

    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth, 
            height: window.innerHeight,
            transparent: true,
            antialias: true,
        });
        document.querySelector("#container").appendChild(this.app.view);

        this.stage = this.app.stage;
        this.treeLayer = new PIXI.Graphics();
        this.leafLayer = new PIXI.Graphics();
        this.stage.addChild(this.treeLayer);
        this.stage.addChild(this.leafLayer);

        this.config = {
            radius: randomBounds(40, 50),
            splitChance: -1,
            position: {},
            velocity: { x: 0, y: -1 },
            spread: 10,
            saturation: 100,
        };
        this.nodes = [];

        // Center position after calculations
        this.config.position = {
            x: ((window.innerWidth / 2) - (this.config.radius / 2)),
            y: (window.innerHeight - this.config.radius),
        };
    }

    async init() {
        this._createRootNode();
        this.app.ticker.add(() => {
            // Grow Tree
            this.nodes.forEach((node) => node.grow());
        });
    }

    _createRootNode() {
        const position      = this.config.position;
        const velocity      = this.config.velocity;
        const splitChance   = this.config.splitChance;
        const radius        = this.config.radius;
        const hsl = {
            h: randomBounds(0, 360),
            s: 50,
            l: randomBounds(20, 80),
        };
        this.nodes.push(new Node(
            this, null, position, velocity, splitChance, radius, hsl
        ));
    }

}

class Leaf {
    constructor(app, position, radius, hsl) {
        this.app = app;
        this.position = position;
        this.radius = radius;
        this.hsl = hsl;
    }

    paint() {
        const color = HSLToHex(this.hsl.h, this.hsl.s, this.hsl.l);
        const leaf = new PIXI.Graphics();
        leaf.beginFill(color, randomBounds(0.5, 1));
        leaf.drawCircle(this.position.x, this.position.y, this.radius);
        leaf.endFill();
        this.app.leafLayer.addChild(leaf);
    }
}

class Node {
    
    constructor(app, parent, position, velocity, splitChance, radius, hsl) {
        this.app = app;
        this.parent = parent;
        this.position = position;
        this.velocity = velocity;
        this.splitChance = splitChance;
        this.radius = radius;
        this.hsl = hsl;
        this.grown = false;
        this.leafz = [];
    }

    paint() {
        let parentPos = {
            x: this.position.x,
            y: this.position.y,
        };
        if (this.parent != null) {
            parentPos = {
                x: this.parent.position.x,
                y: this.parent.position.y,
            };
        }
        
        const color = HSLToHex(this.hsl.h, this.hsl.s, this.hsl.l);
        // this.app.treeLayer.beginTextureFill(this.app.rootTexture, color);

        if (randomBounds(0, 1) < .02) {
            this.app.treeLayer.beginFill(color);
            this.app.treeLayer.drawCircle(
                this.position.x,
                this.position.y + this.velocity.y,
                this.radius / 16
            );
            this.app.treeLayer.endFill();
        }

        this.app.treeLayer.lineStyle(this.radius, color, 1);
        this.app.treeLayer.moveTo(parentPos.x, parentPos.y);
        this.app.treeLayer.lineTo(this.position.x + (1.5 * this.velocity.x), this.position.y + (1.5 * this.velocity.y));
        // this.app.treeLayer.endFill();
    }

    grow() {
        if (!this.grown) {
            if (this.radius > randomBounds(3, 4)) {
                const newSplitChance = this.splitChance + .15;
                let newVelX = randomBounds(-.05, .05);
                const newVelocity = {
                    x: this.velocity.x + newVelX,
                    y: this.velocity.y
                };
                const newPos = {
                    x: this.position.x + (newVelocity.x * 5),
                    y: this.position.y + (newVelocity.y * 5)
                };
                const newRadius = this.radius - randomBounds(0.2, 0.4);
                const newHSL = {
                    ...this.hsl,
                    s: (this.radius / this.app.config.radius) * 100,
                };
                this.app.nodes.push(new Node(
                    this.app, this, newPos, newVelocity, newSplitChance, newRadius, this.hsl
                ));
                this.addLeaf();
                this.branch(this.radius - randomBounds(1, 6));
                this.paint();
            }
            
            this.grown = true;
        }
    }

    branch(radius) {
        const splitMargin = randomBounds(1, 100);
        if (this.splitChance > splitMargin) {
            const newVelX = this.velocity.x + randomBounds(-2, 2);
            const newVelY = this.velocity.y + randomBounds(-.2, .2);
            const velDelta = 1;
            const newVel = {
                x: Math.max(Math.min(newVelX, velDelta), -velDelta),
                y: Math.max(Math.min(newVelY, velDelta), -velDelta),
            }
            const splitVel = {
                x: (newVel.x) / 1.25,
                y: (newVel.y) / 1.25,
            };
            const splitPos = {
                x: this.position.x,
                y: this.position.y,
            };
            this.app.nodes.push(new Node(
                this.app, this, splitPos, splitVel, this.splitChance, radius, this.hsl
            ));
        }
    }

    addLeaf() {
        const startRadius = this.app.config.radius;
        if (this.radius <= (startRadius / 5) && (randomBounds(0, 1) > 0.5)) {
            const leafPos = {
                x: this.position.x,
                y: this.position.y
            };
            const leafRadius = randomBounds(1, 15);
            const leafHSL = {
                h: (this.hsl.h + 180) % 360,
                s: randomBounds(50, 100),
                l: (this.hsl.l + 20) % 100,
            };
            const leaf = new Leaf(this.app, leafPos, leafRadius, leafHSL);
            this.leafz.push(leaf);
            leaf.paint();
        }
    }
}

new SpootApp().init();

//
// Utils
// 

function HSLToHex(h,s,l) {
    h = Math.floor(h) % 360;
    s = Math.floor(s) % 100;
    l = Math.floor(l) % 100;

    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
  
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);
  
    // Prepend 0s, if necessary
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return Number("0x" + r + g + b);
} 

function randomBounds(min, max) {
    return (Math.random() * (max - min)) + min;
}