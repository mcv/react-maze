import {WormholeEntrance} from './board.js';

export default class AStar {
    constructor (board) {
        this.board = board;
        this.width = board.width;
        this.height = board.height;
        this.obstacles = board.obstacles;
        this.wormholeExits = board.wormholeExits;
        this.wormholeEntrances = board.wormholeEntrances;

        this.startfield = this.board.startpoint.field;
        this.endfield = this.board.endpoint.field;

        this.wormholeExitDistance = this.wormholeExits.reduce((min, wormhole) => {
            return Math.min(min, this.manhattanDistance(wormhole.field, this.endfield));
        }, Infinity);

    }


    wormholeDistance = (field) => {
        let wormholeEntranceDistance = this.wormholeEntrances.reduce((min, entrance) => {
            return Math.min(min, this.manhattanDistance(field, entrance.field));
        }, Infinity);
        return wormholeEntranceDistance + this.wormholeExitDistance +1;
    };

    manhattanDistance = (fieldA, fieldB) => Math.abs(fieldA.x-fieldB.x)+Math.abs(fieldA.y-fieldB.y);

    distanceEstimate = (fieldA, fieldB) => {
        return Math.min(this.wormholeDistance(fieldA), this.manhattanDistance(fieldA, fieldB));
    };

    getNeighbours = (field) => {
        let neighbours = [];
        let x = field.x;
        let y = field.y;


        if (x>0) neighbours.push(this.board.get(x-1,y));
        if (y>0) neighbours.push(this.board.get(x,y-1));
        if (x<this.width-1) neighbours.push(this.board.get(x+1,y));
        if (y<this.height-1) neighbours.push(this.board.get(x,y+1));
        console.log("this.board.get(x,y).getContent(): ",this.board.get(x,y).getContent());
        if (this.board.get(x,y).getContent() instanceof WormholeEntrance) {
            this.board.wormholeExits.forEach(exit => neighbours.push(exit.field));
        }
        console.log("neighbours: ",neighbours.map(x=>x.coords.toString()));
        return neighbours;
    };


    search() {
        let startfield = this.startfield;
        let endfield = this.endfield;

        let closedSet = new Set();
        let openSet = [];
    
        startfield.setPath(0, this.manhattanDistance(startfield, endfield), []);
        openSet.push(startfield);

        let addNeighbour = neighbour => {
            if (!closedSet.has(neighbour)) {
                // console.log("neighbour: ",neighbour);
                let distanceTo = current.distanceTo+neighbour.stepTo();
                if (distanceTo < neighbour.distanceTo) {
                    neighbour.setPath(
                        distanceTo,
                        this.distanceEstimate(neighbour, endfield),
                        current.pathTo.concat(neighbour)
                    );
                    console.log("n dist: ",this.distanceEstimate(neighbour, endfield));
                    openSet.push(neighbour);
                }
                console.log("neighbour ",neighbour.coords, neighbour.distanceTo);
            }
        };


        let current;
        do {
            current = openSet.pop();
            console.log("current: ",current.coords, current.distanceTo);
            this.getNeighbours(current).forEach(addNeighbour);
    
            closedSet.add(current);
            openSet.sort((a, b) => (b.distanceTo+b.distanceFrom)-(a.distanceTo+a.distanceFrom));
            console.log("openSet: ",openSet.map(x=>x.coords.toString()));
            console.log("closedSet: ",[...closedSet].map(x=>x.coords.toString()));
        } while (openSet.length > 0 && current!==endfield && current.distanceTo < 100);

        console.log("current: ",current);

        return current;
    }

}