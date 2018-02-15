import React from 'react';
import ActionButtons from './actionButtons.js';
import Board from './board.js';
import AStar from './searchAlgorithms.js';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 8,
            height: 8,
            scale: 50,
            msg: "",
            successPath: [],
            success: false,
            actionCallback: ()=>{}
        };
        this.board = Board.createBoard(this.state.width, this.state.height, this);
        this.board.init();
    }

    changeWidth = event => this.setState({width: event.target.value});

    changeHeight = event => this.setState({height: event.target.value});

    setMsg = text => this.setState({msg: text});

    setAction = actionCallback => this.setState({actionCallback: actionCallback});

    clear = () => {
        this.setState({
            success: false,
            successPath: [],
            msg: "Board has been cleared"
        });
        this.board.clearAll();
        console.log("grid cleared");
    };
    play = () => {
        console.log("play");

        if (this.board.ready()) {
            let searchAlgorithm = new AStar(this.board);

            let result = searchAlgorithm.search();

            if (result.state.content === this.board.endpoint) {
                this.setState({
                    successPath: result.pathTo,
                    success: true
                });
                this.setMsg("Shortest path found! Distance: "+result.distanceTo);
            }
            else {
                this.setMsg("No path can be found");
            }
        }
        else {
            this.setMsg("Set start and end points");
        }

    };

    render() {
        if (this.board.width !== this.state.width || this.board.height !== this.state.height) {
            this.board.setSize(this.state.width, this.state.height);
        }


        return (
            <div>
                <div>
                    <label>Width: </label><input id="width" type="number" value={this.state.width} onChange={this.changeWidth}/>
                    <label>Height: </label><input id="height" type="number" value={this.state.height} onChange={this.changeHeight}/>
                </div>
                <div className="board-row">
                    <ActionButtons grid={this}/>
                </div>
                <div className="message">{this.state.msg}</div>
                {this.renderBoard()}
            </div>
        );
    }

    renderSuccessPath() {
        let scale = this.state.scale;
        let pathString = 'M';
        let applyScale = coord => (coord+0.5)*scale;
        let drawPoint = field => applyScale(field.x)+","+applyScale(field.y);
        pathString += drawPoint(this.board.startpoint.field);
        this.state.successPath.forEach(field => {
            pathString += 'L'+drawPoint(field);
        });
        //+f.x+','+f.y+'L'+(f.x-5)+','+f.y+',L'+f.x+','+(f.y+10)+'L'+(f.x+5)+','+f.y+'Z'
        return <path d={pathString} stroke="red" fill="none"></path>
    }


    renderBoard() {
        let width = this.state.width;
        let height = this.state.height;
        let scale = this.state.scale;

        // let rows = [];
        let fields = [];
        for (var y=0; y<height; y++) {
            for (let x=0; x<width; x++) {
                fields.push(<Field key={x.toString()+'-'+y.toString()} coords={[x,y]}
                                   board={this.board}
                                   action={this.state.actionCallback} scale={scale}/>)
            }
            // rows.push(<div key={y} className="board-row">{fields}</div>);
        }
        let successPath = '';
        if (this.state.success) {
            successPath = this.renderSuccessPath();
        }
        return (<svg version="1.1" height={height*scale} width={width*scale} xmlns="http://www.w3.org/2000/svg">
                    {fields}
                    {successPath}
                </svg>)

    }
}


class Field extends React.Component {
    constructor(props) {
        super(props);
        this.coords = [this.x, this.y] = this.props.coords;
        this.state = {
            content: null
        };
        this.board = this.props.board;
        this.board.set(this.x, this.y, this);
        this.reset();
    }
    setContent(content) {
        console.log("setContent");
        this.setState({content: content});
    }
    getContent() {
        return this.state.content;
    }
    label() {
        return this.state.content? this.state.content.label: "";
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
        return this.state.content? this.state.content.stepTo : 1;
    }

    render() {
        return (
            <g>
                <rect x={(this.x)*this.props.scale}
                      width="50"
                      height="50"
                      fill="white"
                      stroke="black"
                      y={(this.y)*this.props.scale}
                      onClick={event => this.props.action(event, this)}></rect>
                <text x={(this.x+0.5)*this.props.scale}
                      y={(this.y+0.5)*this.props.scale}
                      textAnchor="middle" alignmentBaseline="central"
                      fontFamily="Verdana" fontSize="15" fill="red">{this.label()}</text>
            </g>
        );
    }
}
