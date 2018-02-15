import {ObstacleRegistry, WormholeEntrance} from './obstacles.js';

class SearchNode {
    constructor(coords, obstacle) {
        [this.x, this.y] = this.coords = coords;
        this.reset();
        if (obstacle) this.setObstacle(obstacle);
    }
    reset() {
        this.distanceTo = Infinity;
        this.distanceFrom = Infinity;
        this.pathTo = [];
    }
    setObstacle(obstacle) {
        this.obstacle = obstacle;
        if (obstacle) {
            obstacle.setNode(this);
        }
    }
    setPath(distanceTo, distanceFrom, pathTo) {
        this.distanceTo = distanceTo;
        this.distanceFrom = distanceFrom;
        this.pathTo = pathTo;
    }
    stepTo() {
        return this.obstacle? this.obstacle.stepTo : 1;
    }
}

class Board {
    constructor(width, height, obstacles) {
        this.board = [];
        for (let x=0; x<width; x++) {
            this.board[x] = [];
            for (let y=0; y<height; y++) {
                this.board[x][y] = new SearchNode([x,y]);
            }
        }
        obstacles.forEach(obstacle => this.get(obstacle.coords).setObstacle(obstacle));
    }
    get(x,y) {
        if (x instanceof Array && x.length === 2) {
            [x,y] = x;
        }
        console.log("board.get("+x+", "+y+")");
        if (this.width >= x >= 0 && this.height >= y >= 0) {
            console.log("this.board[x]:", this.board[x]);
            return this.board[x][y];
        }
    }
}

export default class AStar {
    constructor (width, height, obstacleMap, wormholeExits) {
        this.width = width;
        this.height = height;
        this.obstacleRegistry = ObstacleRegistry.getRegistry();
        this.wormholeExits = this.obstacleRegistry.wormholeExits;
        this.board = new Board(width, height, this.obstacleRegistry.obstacles);
    }

    manhattanDistance = (fieldA, fieldB) => Math.abs(fieldA.x-fieldB.x)+Math.abs(fieldA.y-fieldB.y);


    search(start, endpoint) {

        let registry = ObstacleRegistry.getRegistry();
    
        let startpoint = new SearchNode(start.coords, start);

        let getNeighbour = coords => {
            console.log("getNeighbour: ",coords);
            console.log("board.get(): ",this.board.get(coords));
            return this.board.get(coords);

        };
    
        let getNeighbours = (field) => {
            let neighbours = [];
            console.log(field);
            let [x,y] = [field.x, field.y];
            console.log("x,y: ",[x,y]);
            console.log("width,height: ",[this.width,this.height]);
            console.log("1: ",getNeighbour([x-1,y]));
            if (x>0) neighbours.push(getNeighbour([x-1,y]));
            console.log("2: ",this.board.get([x,y-1]));
            if (y>0) neighbours.push(this.board.get([x,y-1]));
            console.log("3: ",this.board.get([x+1,y]));
            if (x<this.width) neighbours.push(this.board.get([x+1,y]));
            console.log("4: ",this.board.get([x,y+1]));
            if (y<this.height) neighbours.push(this.board.get([x,y+1]));
            // if (y>0) neighbours.push([x,y-1]);
            // if (x<this.width) neighbours.push([x+1,y]);
            // if (y<this.height) neighbours.push([x,y+1]);
//            if (board.get([x,y]) instanceof WormholeEntrance) {
            if (this.board.get([x,y]).obstacle instanceof WormholeEntrance) {
                ObstacleRegistry.wormholeExits.forEach(exit => neighbours.push(exit.node));
            }
            console.log("neighbours: ",neighbours);
            return neighbours;
        };
    
        let stepTo = coords => {
            let [x,y] = coords;
            if (this.board.has([x,y])) {
                return this.board.get([x,y]).stepTo();
            }
            else {
                return 1;
            }
        };
    
    
        // let pathTo = new Map();
        // pathTo.set(this.startpoint, new Path(0, [this.startpoint]));
    
        let closedSet = new Set();
        let openSet = [];
    
        startpoint.setPath(0, this.manhattanDistance(startpoint, endpoint), []);
        openSet.push(startpoint);
    
        let current;
        do {
            current = openSet.pop();
            getNeighbours(current).forEach(neighbour => {
                if (!closedSet.has(neighbour) && openSet.indexOf(neighbour)===-1) {
                    console.log("neighbour: ",neighbour);
                    let distanceTo = current.distanceTo+neighbour.stepTo();
                    if (distanceTo < neighbour.distanceTo) {
                        neighbour.setPath(
                            distanceTo,
                            this.manhattanDistance(neighbour, endpoint),
                            current.pathTo.concat(neighbour)
                        );
                        console.log("adding neighbour: ",neighbour);
                        openSet.push(neighbour);
                    }
                }
            });
    
            closedSet.add(current);
            console.log("current: ",current);
            console.log("current.distanceTo: ",current.distanceTo);
            openSet.sort((a, b) => (b.distanceTo+b.distanceFrom)-(a.distanceTo+a.distanceFrom));
        } while (openSet.length > 0 && current!==endpoint && current.distanceTo < 10);
    
        return current;
    }

}