import React from 'react';
import {Boulder, Gravel, WormholeEntrance, WormholeExit} from './board.js';

export default class ActionButtons extends React.Component {

    render() {
        let grid = this.props.grid;

        return (
            <div>
                <ActionButton     setMsg={grid.setMsg} action={grid.clear}        title="Clear all" msg="Grid cleared" />
                <StartButton      setMsg={grid.setMsg} setAction={grid.setAction} title="Begin"     msg="Place start point" item={grid.board.startpoint}/>
                <EndButton        setMsg={grid.setMsg} setAction={grid.setAction} title="End"       msg="Place end point"   item={grid.board.endpoint}/>
                <BoulderButton    setMsg={grid.setMsg} setAction={grid.setAction} title="Boulder"   msg="Place boulder"/>
                <GravelButton     setMsg={grid.setMsg} setAction={grid.setAction} title="Gravel"    msg="Place gravel"/>
                <WormholeEntranceButton   setMsg={grid.setMsg} setAction={grid.setAction} title="Wormhole entrance"  msg="Place wormhole entrance"/>
                <WormholeExitButton   setMsg={grid.setMsg} setAction={grid.setAction} title="Wormhole exit"  msg="Place wormhole exit"/>
                <ActionButton setMsg={grid.setMsg} action={grid.play} title="Play" msg="Solving maze..."/>
            </div>
        );
    }
}
class ActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.title = this.props.title;
        this.msg = this.props.msg;
    }
    onClick = () => {
        this.props.setMsg(this.msg);
        if (this.props.action) {
            this.props.action();
        }
        else {
            this.action();
        }
    };
    render() {
        return (
            <button className="button" onClick={this.onClick}>
                {this.title}
            </button>
        );
    }
}

class StartButton extends ActionButton {
    constructor(props) {
        super(props);
        this.startpoint = props.item;
    }
    action = () => {
        this.props.setAction((event, field) => {
            this.startpoint.setPoint(field);
        });
    };
}
class EndButton extends ActionButton {
    constructor(props) {
        super(props);
        this.endpoint = props.item;
    }
    action = () => {
        this.props.setAction((event, field) => {
            this.endpoint.setPoint(field);
        });
    };
}

class BoulderButton extends ActionButton {
    action = () => {
        this.props.setAction((event, field) => {
            field.setContent(new Boulder(field));
            console.log("boulder: ",field);
        });
    };
}

class GravelButton extends ActionButton {
    action = () => {
        this.props.setAction((event, field) => {
            field.setContent(new Gravel(field));
            console.log("gravel: ",field);
        });
    };
}

class WormholeEntranceButton extends ActionButton {
    action = () => {
        this.props.setAction((event, field) => {
            field.setContent(new WormholeEntrance(field));
        });
    };

}

class WormholeExitButton extends ActionButton {
    action = () => {
        this.props.setAction((event, field) => {
            field.setContent(new WormholeExit(field));
        });
    };
}
