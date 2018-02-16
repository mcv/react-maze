import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './game.js';

// class App extends React.Component {
//     render() {
//         return (
//             <div className="game">
//                 <Game />
//             </div>
//         );
//     }
// }


ReactDOM.render(
<Game />,
    document.getElementById('root')
);
