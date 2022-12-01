import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/nav_bar';


class poetWall extends Component {
    constructor(props) {
        super(props);

        this.state = { unRegistered };
    }

    render() {
        return (
            <div>
                <NavBar />
                <PoetWall unRegistered={this.state.unRegistered/>
            </div>
        )
    }
}



// Take thoses component's generated HTML and put it 
// on the page (in the DOM)
ReactDOM.render(<poetWall />, document.querySelector('.container'));