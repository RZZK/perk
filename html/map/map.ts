/// <reference path="GMaps.d.ts" />
/// <reference path="../assets/jquery.min.js" />


class Map {
    map: google.maps.Map;
    lat: number;

}









class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    getDst() {
        return Math.sqrt(this.x * this.x +
            this.y * this.y);
    }
}
var p = new Point(3, 4);
var dist = p.getDst();
alert("Hypotenuse is: " + dist);