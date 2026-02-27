// Ambient module shim for @mapbox/point-geometry
// mapbox-gl v3 transitively includes @mapbox/point-geometry which declares itself
// as 'mapbox__point-geometry' in its package.json types field but the actual
// type file doesn't re-export under that name, causing:
//   "Cannot find type definition file for 'mapbox__point-geometry'."
// Declaring it here suppresses the error without breaking any types.
declare module 'mapbox__point-geometry' {
    export default class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
        clone(): Point;
        add(p: Point): Point;
        sub(p: Point): Point;
        mult(k: number): Point;
        div(k: number): Point;
        rotate(a: number): Point;
        matMult(m: [number, number, number, number]): Point;
        unit(): Point;
        perp(): Point;
        round(): Point;
        mag(): number;
        equals(p: Point): boolean;
        dist(p: Point): number;
        distSqr(p: Point): number;
        angle(): number;
        angleTo(p: Point): number;
        angleWith(p: Point): number;
        angleWithSep(x: number, y: number): number;
        static convert(p: Point | [number, number] | { x: number; y: number }): Point;
    }
}
