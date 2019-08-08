import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './BreadshelfList.css';

class BreadshelfListBase extends Component {
    constructor(props) {
        super(props);

        this.willReadState = {
            paperColor: '#4fff69',
            floatDirection: 'left',
            tenseTitle: 'Will Read'
        }

        this.haveReadState = {
            paperColor: '#42e6ff',
            floatDirection: 'right',
            tenseTitle: 'Have Read'
        }

        if(this.props.tense === "will") {
            this.state = { ...this.state, ...this.willReadState };
        } else {
            this.state = { ...this.state, ...this.haveReadState };
        }

    }

    render() {

        const paperStyle = {
            backgroundColor: this.state.paperColor,
            height: '100%'
        };

        return (
            <div className="BreadshelfList" style={{float: this.state.floatDirection}}>
                <Paper style={paperStyle}>
                   <Typography variant="h6">{this.state.tenseTitle}</Typography>
                </Paper>
            </div>
        );
    }
}

export default BreadshelfListBase;