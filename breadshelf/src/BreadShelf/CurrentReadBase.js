import React, { Component } from 'react';
import './CurrentRead.css';

class CurrentReadBase extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="CurrentRead">
                <h2 className="BookProp Read">The Book</h2><h4 className="BookProp Author">Noah Celuch</h4>
            </div>
        );
    }

}

export default CurrentReadBase;