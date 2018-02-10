import React from 'react';

export default class ActionButtons extends React.Component {

    render() {
        let grid = this.props.grid;

        return (
            <div>
                <ActionButton     setMsg={grid.setMsg} action={grid.clear}        title="Clear all" msg="Grid cleared" />
                <ClearButton      setMsg={grid.setMsg} setAction={grid.setAction} title="Clear"     msg="Select field to clear"/>
                <StartButton      setMsg={grid.setMsg} setAction={grid.setAction} title="Begin"     msg="Place start point" item={grid.startpoint}/>
                <EndButton        setMsg={grid.setMsg} setAction={grid.setAction} title="End"       msg="Place end point"   item={grid.endpoint}/>
                <BoulderButton    setMsg={grid.setMsg} setAction={grid.setAction} title="Boulder"   msg="Place boulder"/>
                <GravelButton     setMsg={grid.setMsg} setAction={grid.setAction} title="Gravel"    msg="Place gravel"/>
                <WormholeButton   setMsg={grid.setMsg} setAction={grid.setAction} title="Wormhole"  msg="Place wormhole entrance"/>
                <ActionButton     setMsg={grid.setMsg} action={grid.play}         title="Play"      msg="Solving maze..."/>
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
            <button className="square" onClick={this.onClick}>
                {this.title}
            </button>
        );
    }
}

class ClearButton extends ActionButton {
    action = () => {
        this.props.setAction((event, field) => {
            console.log("TODO: clear field")
        });
    };
}
class StartButton extends ActionButton {
    constructor(props) {
        super(props);
        this.startpoint = props.item;
    }
    action = () => {
        this.props.setAction((event, field) => {
            console.log("place startpoint on ",field);
            this.startpoint.setPoint(field);
            field.setContent(this.startpoint);
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
            console.log("place endpoint on ",field);
            this.endpoint.setPoint(field);
            field.setContent(this.endpoint);
        });
    };
}
class Boulder {
    constructor(coords) {
        this.coords = coords;
    }
    label = "B";
}
class BoulderButton extends ActionButton {
    action = () => {
        this.props.setAction((event, field) => {
            console.log("place boulder on ",field);
            field.setContent(new Boulder(field.coords));
        });
    };
}
class Gravel {
    constructor(coords) {
        this.coords = coords;
    }
    label = "G";
}
class GravelButton extends ActionButton {
    action = () => {
        this.props.setMsg("Place gravel");
        this.props.setAction((event, field) => {
            console.log("place gravel on ",field);
            field.setContent(new Gravel(field.coords));
        });
    };
}
class Wormhole {
    constructor(coords) {
        this.entrance = coords;
    }
    label = "W";
    setExit(coords) {
        this.ext = coords;
    }
}
class WormholeButton extends ActionButton {
    select = (event, entranceField) => {
        console.log("place wormhole entrance on ",entranceField);
        let wormhole = new Wormhole(entranceField.coords);
        entranceField.setContent(wormhole);
        this.props.setMsg("Place wormhole exit");
        this.props.setAction((event, exitField) => {
            console.log("place wormhole exit on ",exitField);
            this.props.setMsg(this.props.msg);
            this.props.setAction(this.select);
            wormhole.setExit(exitField.coords);
            exitField.setContent(wormhole);
        })
    };
    action = () => {
        this.props.setAction(this.select);
    };

}
