import { randomBounds, HSLToHex } from "./utils";
import Leaf from "./leaf";
import config from "./config";
import DrawElement from "./draw-element";

export default class TreeNode extends DrawElement {
    
    constructor(parent, position, velocity, splitChance, radius, layer) {
        super();
        this.parent = parent;
        this.position = position;
        this.velocity = velocity;
        this.splitChance = splitChance;
        this.radius = radius;
        this.layer = layer;
        this.hsl = parent?.hsl ?? {
            h: randomBounds(0, 360),
            s: 50,
            l: randomBounds(20, 80),
        };
        this.child = null;
        this.paint();
        this.addLeaf();
    }

    /**
     * Paint the node
     */
    paint() {
        let parentPos = {
            x: this.parent?.position.x ?? this.position.x,
            y: this.parent?.position.y ?? this.position.y,
        };
        const color = HSLToHex(this.hsl.h, this.hsl.s, this.hsl.l);
        this.layer.lineStyle(this.radius, color, 1);
        this.layer.moveTo(parentPos.x, parentPos.y);
        const paddingX = (1.5 * this.velocity.x);
        const paddingY = (1.5 * this.velocity.y);
        this.layer.lineTo(this.position.x + paddingX, this.position.y + paddingY);
    }

    /**
     * Advance the growth of the tree
     */
    grow() {
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
        const newNode = new TreeNode(this, newPos, newVelocity, newSplitChance, newRadius, this.layer);
        this.child = newNode;
        return newNode;
    }

    /**
     * Branch the current node
     */
    branch() {
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
        const splitRadius = this.radius - randomBounds(1, 6);
        return new TreeNode(this, splitPos, splitVel, this.splitChance, splitRadius, this.layer);
    }

    /**
     * Add a leaf to the current node
     */
    addLeaf() {
        if (this.shouldSpawnLeaf) {
            const leafPos = {
                x: this.position.x,
                y: this.position.y
            };
            const leafRadius = randomBounds(1, 15);
            const leafHSL = {
                h: this.hsl.h + randomBounds(170, 190),
                s: randomBounds(50, 100),
                l: this.hsl.l,
            };
            new Leaf(leafPos, leafRadius, leafHSL, this.layer);
        }
    }

    /**
     * Determine whether the node should continue growing
     */
    get shouldGrow() {
        return this.radius > config.minWidth;
    }

    /**
     * Determine whether the node should create a branch
     */
    get shouldBranch() {
        return this.splitChance > randomBounds(1, 90);
    }

    /**
     * Determine whether the node should spawn a leaf
     */
    get shouldSpawnLeaf() {
        return this.radius <= (config.radius / 5) && randomBounds(0, 1) < 0.5;
    }
}