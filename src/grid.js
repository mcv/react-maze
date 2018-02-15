import React from 'react';
import ActionButtons from './actionButtons.js';
import {StartPoint, EndPoint, WormholeEntrance, WormholeExit, Board} from './obstacles.js';
import AStar from './searchAlgorithms.js';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 5,
            height: 5,
            obstacles: [],
            msg: "",
            actionCallback: ()=>{}
        };
        this.startpoint = new StartPoint();
        this.endpoint = new EndPoint();
    }

    changeWidth = event => this.setState({width: event.target.value});

    changeHeight = event => this.setState({height: event.target.value});

    setMsg = text => this.setState({msg: text});

    setAction = actionCallback => this.setState({actionCallback: actionCallback});

    clear = () => {
        console.log("grid cleared");
    };
    play = () => {
        console.log("play");

        let searchAlgorithm = new AStar(this.state.width, this.state.height);

        let result = searchAlgorithm.search(this.startpoint, this.endpoint);

        if (result === this.endpoint) {
//            this.displayPath(endpoint);
            this.setMsg("Shortest path found!");
        }
        else {
            this.setMsg("No path can be found");
        }


    };

    render() {
        const status = 'Next player: X';

        let rows = [];
        for (var y=0; y<this.state.height; y++) {
            let fields = [];
            for (let x=0; x<this.state.width; x++) {
                fields.push(<Field key={x.toString()+'-'+y.toString()} coords={[x,y]} action={this.state.actionCallback}/>)
            }
            rows.push(<div key={y} className="board-row">{fields}</div>);
            // rows.push(<Row key={y} y={y} columnsAmount={this.state.xwidth} action={this.state.actionCallback}/>);
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div>
                    <label>Width: </label><input id="width" type="number" value={this.state.width} onChange={this.changeWidth}/>
                    <label>Height: </label><input id="height" type="number" value={this.state.height} onChange={this.changeHeight}/>
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
