export default class Board {
    constructor(width, height, grid) {
        this.width = width;
        this.height = height;
        this.board = [];
        this.grid = grid
        this.resize();
    }
    init() {
        this.obstacles = [];
        this.wormholeEntrances = [];
        this.wormholeExits = [];
        this.startpoint = new StartPoint();
        this.endpoint = new EndPoint();
    }
    ready() {
        return this.startpoint && this.endpoint;
    }
    resize() {
        let board = [];
        for (let x=0; x<this.width; x++) {
            if (this.board[x] !== undefined) {
                board[x] = this.board[x];
            }
            else {
                board[x] = [];
            }
        }
        this.board = board;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.resize();
    }
    set(x,y, field) {
        this.board[x][y] = field;
    }
    get(x,y) {
        console.log("get("+x+", "+y+")");
        return this.board[x][y];
    }
    clearAll() {
        this.obstacles.forEach(obstacle => {
            obstacle.field.setContent(null);
        });
        this.init();
    }
    register(obstacle) {
        if (obstacle instanceof StartPoint) {
            this.startpoint = obstacle;
        }
        if (obstacle instanceof EndPoint) {
            this.endpoint = obstacle;
        }
        if (obstacle instanceof WormholeEntrance) {
            console.log("wormhole entrance");
            this.wormholeEntrances.push(obstacle);
        }
        if (obstacle instanceof WormholeExit) {
            console.log("wormhole exit");
            this.wormholeExits.push(obstacle);
        }
        this.obstacles.push(obstacle);
    }
    static createBoard(width, height, grid) {
        if (!this.instance) {
            this.instance = new Board(width, height, grid);
        }
        else {
            this.instance.setSize(width, height);
            this.grid = grid;
        }
        return this.instance;
    }
    static getBoard() {
        return this.instance;
    }
}

class Obstacle {
    constructor(field) {
        if (field) {
            this.field = field;
            this.coords = field.coords;
        }
        else {
            this.field = null;
            this.coords = null;
        }
        Board.getBoard().register(this);
    }
    stepTo = 1;
    setNode(node) {
        this.node = node;
    }
}
class UniquePoint extends Obstacle {
    setPoint = field => {
        console.log("old field: ",this.field);
        if (this.field) {
            this.field.setContent(null);
        }
        this.field = field;
        this.field.setContent(this);
        this.coords = field.coords;
    };
}
export class StartPoint extends UniquePoint {
    label = "Start";
}

export class EndPoint extends UniquePoint {
    label = "End";
}

export class Boulder extends Obstacle {
    label = "B";
    stepTo = Infinity;
}

export class Gravel extends Obstacle {
    label = "G";
    stepTo = 2;
}

export class WormholeEntrance extends Obstacle {
    label = "Win";
}

export class WormholeExit extends Obstacle {
    label = "Wexit";
}
