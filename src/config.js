import { randomBounds } from "./utils";

export default {
    radius: randomBounds(40, 50),
    splitChance: -1,
    position: {},
    velocity: { x: 0, y: -1 },
    spread: 10,
    saturation: 100,
    minWidth: 4,
};