export default class DrawElement {

    /**
     * Paint the DrawElement
     *  NOTE: This method must be overridden in the child class
     */
    paint() {
        throw new Error("ERROR: DRAW ELEMENT MUST OVERRIDE paint()!");
    }
    
}