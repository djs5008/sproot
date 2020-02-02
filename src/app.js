import * as PIXI from "pixi.js";
import { DropShadowFilter, AsciiFilter, AdvancedBloomFilter } from "pixi-filters";
import config from "./config";
import TreeNode from "./tree-node";

export default class SprootApp {

    constructor() {
        // Setup PIXI
        this.app = new PIXI.Application({
            width: window.innerWidth, 
            height: window.innerHeight,
            transparent: true,
            antialias: true,
        });
        document.querySelector("#container").appendChild(this.app.view);
        this.layer = new PIXI.Graphics();
        this.app.stage.addChild(this.layer);

        // Add Filter(s)
        this.layer.filters = [
            new DropShadowFilter({
                color: 0x111111,
                alpha: 1,
                blur: 1,
                distance: 0,
                quality: 10,
                resolution: window.devicePixelRatio ?? 1
            }),
        ];


        this.nodes = [];

        // Center position after calculations
        config.position = {
            x: ((window.innerWidth / 2) - (config.radius / 2)),
            y: (window.innerHeight - config.radius),
        };
    }

    /**
     * Initialize SprootApp
     */
    async init() {
        this.nodes.push(this._createRootNode());
        this.app.ticker.add(() => this._growTree());
    }

    /**
     * Create the root node of the tree
     *  NOTE: Initial tree properties use src/config.js properties
     */
    _createRootNode() {
        const position      = config.position;
        const velocity      = config.velocity;
        const splitChance   = config.splitChance;
        const radius        = config.radius;
        const layer         = this.layer;
        return new TreeNode(null, position, velocity, splitChance, radius, layer);
    }

    /**
     * Advance tree growth
     */
    _growTree() {
        this.nodes = this.nodes
            .filter((node) => node != null)
            .filter((node) => node.child == null)
            .filter((node) => node.radius > config.minWidth);
        this.nodes.forEach((node) => {
            if (node.shouldGrow) this.nodes.push(node.grow());
            if (node.shouldBranch) this.nodes.push(node.branch());
        });
    }
}

new SprootApp().init();