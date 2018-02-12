export class ObstacleRegistry {
    constructor() {
        this.obstacles = [];
        this.wormholeEntrances = [];
        this.wormholeExits = [];
    }
    register(obstacle) {
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
    clearAll() {
        this.obstacles.forEach(obstacle => {
            obstacle.field.content = null;
        });
        this.obstacles = [];
        this.wormholeEntrances = [];
        this.wormholeExits = [];
    }
    static getRegistry() {
        if (!this.registry) {
            this.registry = new ObstacleRegistry();
        }
        return this.registry;
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
        ObstacleRegistry.getRegistry().register(this);
    }
    stepTo = 1;
}
class UniquePoint extends Obstacle {
    setPoint = field => {
        console.log("old field: ",this.field);
        if (this.field) {
            this.field.content = null;
        }
        this.field = field;
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
