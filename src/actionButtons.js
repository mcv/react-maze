import React from 'react';
import {Boulder, Gravel, WormholeEntrance, WormholeExit} from './board.js';

export default class ActionButtons extends React.Component {

    render() {
        let game = this.props.game;

        return (
            <div>
                <ActionButton     setMsg={game.setMsg} action={game.clear}        title="Clear all" msg="Board cleared" />
                <StartButton      setMsg={game.setMsg} setAction={game.setAction} title="Begin"     msg="Place start point" item={game.board.startpoint}/>
                <EndButton        setMsg={game.setMsg} setAction={game.setAction} title="End"       msg="Place end point"   item={game.board.endpoint}/>
                <BoulderButton    setMsg={game.setMsg} setAction={game.setAction} title="Boulder"   msg="Place boulder"/>
                <GravelButton     setMsg={game.setMsg} setAction={game.setAction} title="Gravel"    msg="Place gravel"/>
                <WormholeEntranceButton   setMsg={game.setMsg} setAction={game.setAction} title="Wormhole entrance"  msg="Place wormhole entrance"/>
                <WormholeExitButton   setMsg={game.setMsg} setAction={game.setAction} title="Wormhole exit"  msg="Place wormhole exit"/>
                <ActionButton setMsg={game.setMsg} action={game.play} title="Play" msg="Solving maze..."/>
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
        });
    };
}

class GravelButton extends ActionButton {
    action = () => {
        this.props.setAction((event, field) => {
            field.setContent(new Gravel(field));
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
