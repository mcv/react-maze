import React from 'react';

export default class ActionButtons extends React.Component {

    render() {
        let grid = this.props.grid;

        return (
            <div>
                <Action     setMsg={grid.setMsg} action={grid.clear}        title="Clear all" msg="Grid cleared" />
                <Clear      setMsg={grid.setMsg} setAction={grid.setAction} title="Clear"     msg="Select field to clear"/>
                <Boulder    setMsg={grid.setMsg} setAction={grid.setAction} title="Boulder"   msg="Place boulder"/>
                <Gravel     setMsg={grid.setMsg} setAction={grid.setAction} title="Gravel"    msg="Place gravel"/>
                <Wormhole   setMsg={grid.setMsg} setAction={grid.setAction} title="Wormhole"  msg="Place wormhole entrance"/>
                <Action       setMsg={grid.setMsg} action={grid.play}       title="Play"      msg="Solving maze..."/>
            </div>
        );
    }
}
class Action extends React.Component {
    constructor(props) {
        super(props);
        this.title = this.props.title;
        this.msg = this.props.msg;
    }
    onClick = () => {
        this.props.setMsg(this.msg);
        this.props.action();
    };
    render() {
        return (
            <button className="square" onClick={this.onClick}>
                {this.title}
            </button>
        );
    }
}

class Clear extends React.Component {
    constructor(props) {
        super(props);
        this.title = Clear;
    }
    onClick = () => {
        this.props.setMsg("Select field to clear");
        this.props.setAction((event, field) => {
        });
    };
    render() {
        return (
            <button className="square" onClick={this.onClick}>
                Clear
            </button>
        );
    }
}
class Boulder extends Action {
    onClick = () => {
        this.props.setMsg("Place boulder");
        this.props.setAction((event, field) => {
            console.log("place boulder on ",field);
        });
    };
    render() {
        return (
            <button className="square" onClick={this.onClick}>
                Boulder
            </button>
        );
    }
}
class Gravel extends React.Component {
    onClick = () => {
        this.props.setMsg("Place gravel");
        this.props.setAction((event, field) => {
            console.log("place gravel on ",field);
        });
    };
    render() {
        return (
            <button className="square" onClick={this.onClick}>
                Gravel
            </button>
        );
    }

}
class Wormhole extends React.Component {
    onClick = () => {
        this.props.setMsg("Place wormhole");
        this.props.setAction((event, field) => {
            console.log("place wormhole on ",field);
        });
    };
    render() {
        return (
            <button className="square" onClick={this.onClick}>
                Wormhole
            </button>
        );
    }

}
