import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Grid from './grid.js';

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <Grid />
            </div>
        );
    }
}


ReactDOM.render(
<Game />,
    document.getElementById('root')
);
