import React from 'react';
import ActionButtons from './actionButtons.js';

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
    }

    changeX = event => {
        this.setState({x: event.target.value});
    };

    changeY = event => {
        this.setState({y: event.target.value});
    };

    clear = () => {
        console.log("grid cleared");
    };
    play = () => {
        console.log("play");
    };

    setMsg = text => {
        this.setState({msg: text});
    };

    setAction = actionCallback => {
        this.setState({actionCallback: actionCallback});
    };

    render() {
        const status = 'Next player: X';

        let rows = [];
        for (var y=0; y<this.state.y; y++) {
            rows.push(<Row key={y} columnsAmount={this.state.x} action={this.state.actionCallback}/>);
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

class Row extends React.Component {
    render() {
        let fields = [];
        for (var x=0; x<this.props.columnsAmount; x++) {
            fields.push(<Field key={x.toString()+'-'+this.props.y} action={this.props.action}/>)
        }
        return (
            <div id={this.props.id} className="board-row">
                {fields}
            </div>
        );

    }
}

class Field extends React.Component {
    render() {
        return (
            <button className="square" onClick={event => this.props.action(event, this)}>
                {/* TODO */}
            </button>
        );
    }
}
