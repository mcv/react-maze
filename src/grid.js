import React from 'react';
import ActionButtons from './actionButtons.js';
import {StartPoint, EndPoint, WormholeEntrance, WormholeExit, ObstacleRegistry} from './obstacles.js'

// class FieldRegistry {
//     constructor() {
//         this.obstacles = [];
//         this.wormholeEntrances = [];
//         this.wormholeExits = [];
//     }
//     register(field) {
//         this.obstacles.push(obstacle);
//     }
//     static getRegistry() {
//         if (!this.registry) {
//             this.registry = new FieldRegistry();
//         }
//         return this.registry;
//     }
//
// }

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 5,
            y: 5,
            obstacles: [],
            msg: "",
            actionCallback: ()=>{}
        };
        this.board = [];
        this.startpoint = new StartPoint();
        this.endpoint = new EndPoint();
    }

    changeX = event => this.setState({x: event.target.value});

    changeY = event => this.setState({y: event.target.value});

    setMsg = text => this.setState({msg: text});

    setAction = actionCallback => this.setState({actionCallback: actionCallback});

    clear = () => {
        console.log("grid cleared");
    };
    play = () => {
        console.log("play");

        let board = this.board;
        let startpoint = this.startpoint.field;
        let endpoint = this.endpoint.field;

        let manhattanDistance = (fieldA, fieldB) => Math.abs(fieldA.x-fieldB.x)+Math.abs(fieldA.y-fieldB.y);

        let getNeighbours = (field) => {
            let neighbours = [];
            let [x,y] = [field.x, field.y];
            if (board[y][x-1]) neighbours.push(board[y][x-1]);
            if (board[y-1][x]) neighbours.push(board[y-1][x]);
            if (board[y][x+1]) neighbours.push(board[y][x+1]);
            if (board[y+1][x]) neighbours.push(board[y+1][x]);
            if (field.content instanceof WormholeEntrance) {
                ObstacleRegistry.wormholeExits.forEach(exit => neighbours.push(exit.field));
            }
            console.log("neighbours: ",neighbours);
            return neighbours;
        };

        // let pathTo = new Map();
        // pathTo.set(this.startpoint, new Path(0, [this.startpoint]));

        let closedSet = new Set();
        let openSet = [];

        startpoint.setPath(0, manhattanDistance(startpoint, endpoint), []);
        openSet.push(startpoint);

        let current;
        do {
            current = openSet.pop();
            console.log("current: ",current);
            getNeighbours(current).forEach(neighbour => {
                if (!closedSet.has(neighbour) && openSet.indexOf(neighbour)!==-1) {
                    let distanceTo = current.distanceTo+neighbour.stepTo();
                    if (distanceTo < neighbour.distanceTo) {
                        neighbour.setPath(
                            distanceTo,
                            manhattanDistance(neighbour, endpoint),
                            current.pathTo.concat(neighbour)
                        );
                        openSet.push(neighbour);
                    }
                }
            });

            openSet.sort((a, b) => (b.distanceTo+b.distanceFrom)-(a.distanceTo+a.distanceFrom));
        } while (openSet.length > 0 && current!==endpoint);


        if (current === endpoint) {
//            this.displayPath(endpoint);
            this.setMsg("Shortest path found!");
        }
        else {
            this.setMsg("No path can be found");
        }

        // // Manhattan distance
        //
        // let findPath = (field, path, distance) => {
        //     if (!visited.has(field)) {
        //         visited.add(field);
        //
        //         neighbours.forEach(neighbour)
        //     }
        // }
        //
        // let solution = findPath(this.startpoint, [], 0);
    };

    render() {
        const status = 'Next player: X';

        let rows = [];
        this.board = [];
        for (var y=0; y<this.state.y; y++) {
            let fields = [];
            for (let x=0; x<this.state.x; x++) {
                fields.push(<Field key={x.toString()+'-'+y.toString()} coords={[x,y]} action={this.state.actionCallback}/>)
            }
            rows.push(<div key={y} className="board-row">{fields}</div>);
            // rows.push(<Row key={y} y={y} columnsAmount={this.state.x} action={this.state.actionCallback}/>);
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div>
                    <label>X: </label><input id="x" type="number" value={this.state.x} onChange={this.changeX}/>
                    <label>Y: </label><input id="y" type="number" value={this.state.y} onChange={this.changeY}/>
                </div>
                <div className="board-row">
                    <ActionButtons grid={this}/>
                </div>
                <div className="message">{this.state.msg}</div>
                {rows}
            </div>
        );
    }
}

// class Row extends React.Component {
//     render() {
//         let fields = [];
//         let y = this.props.y;
//         for (var x=0; x<this.props.columnsAmount; x++) {
//             fields.push(<Field key={x.toString()+'-'+y.toString()} coords={[x,y]} action={this.props.action}/>)
//         }
//         return (
//             <div id={this.props.id} className="board-row">
//                 {fields}
//             </div>
//         );
//
//     }
// }

class Field extends React.Component {
    constructor(props) {
        super(props);
        this.coords = [this.x, this.y] = this.props.coords;
        this.state = {
            content: null
        };
        this.reset();
    }
    reset() {
        this.distanceTo = Infinity;
        this.distanceFrom = Infinity;
        this.pathTo = [];
    }
    setPath(distanceTo, distanceFrom, pathTo) {
        this.distanceTo = distanceTo;
        this.distanceFrom = distanceFrom;
        this.pathTo = pathTo;
    }
    stepTo() {
        return this.content? this.content.stepTo : 1;
    }
    setContent(content) {
        this.setState({content: content});
    }
    label() {
        return this.state.content? this.state.content.label: "";
    }
    render() {
        return (
            <button className="square" onClick={event => this.props.action(event, this)}>
                {this.label()}
            </button>
        );
    }
}
