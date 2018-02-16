export default class Board {
    constructor(width, height, game) {
        this.width = width;
        this.height = height;
        this.board = [];
        this.game = game
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
        return this.startpoint.field && this.endpoint.field;
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
        return this.board[x][y];
    }
    clearAll() {
        for(let x = 0; x<this.width; x++)
        for(let y = 0; y<this.height; y++) {
            this.board[x][y].setContent(null);
        }
        // this.obstacles.forEach((obstacle, index, array) => {
        //     console.log("removing "+index, obstacle, array);
        //     if (obstacle.field) {
        //         obstacle.field.setContent(null);
        //     }
        // });
        this.init();
    }
    unregister(obstacle) {
        if (obstacle instanceof StartPoint) {
            this.startpoint = null;
        }
        if (obstacle instanceof EndPoint) {
            this.endpoint = null;
        }
        if (obstacle instanceof WormholeEntrance) {
            this.wormholeEntrances.splice(this.wormholeEntrances.indexOf(obstacle), 1);
        }
        if (obstacle instanceof WormholeExit) {
            this.wormholeExits.splice(this.wormholeExits.indexOf(obstacle), 1);
        }
        this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
    }
    register(obstacle) {
        if (obstacle instanceof StartPoint) {
            this.startpoint = obstacle;
        }
        if (obstacle instanceof EndPoint) {
            this.endpoint = obstacle;
        }
        if (obstacle instanceof WormholeEntrance) {
            this.wormholeEntrances.push(obstacle);
        }
        if (obstacle instanceof WormholeExit) {
            this.wormholeExits.push(obstacle);
        }
        this.obstacles.push(obstacle);
    }
    static createBoard(width, height, game) {
        if (!this.instance) {
            this.instance = new Board(width, height, game);
        }
        else {
            this.instance.setSize(width, height);
            this.game = game;
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
    label = "W in";
}

export class WormholeExit extends Obstacle {
    label = "W exit";
}
