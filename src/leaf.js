import * as PIXI from "pixi.js";
import { randomBounds, HSLToHex } from "./utils";
import DrawElement from "./draw-element";

export default class Leaf extends DrawElement {

    constructor(position, radius, hsl, layer) {
        super();
        this.position = position;
        this.radius = radius;
        this.hsl = hsl;
        this.layer = layer;
        this.paint();
    }

    /**
     * Paint the leaf
     */
    paint() {
        const color = HSLToHex(this.hsl.h, this.hsl.s, this.hsl.l);
        const leaf = new PIXI.Graphics();
        leaf.beginFill(color, randomBounds(0.5, 1));
        leaf.drawCircle(this.position.x, this.position.y, this.radius);
        leaf.endFill();
        this.layer.addChild(leaf);
    }
}