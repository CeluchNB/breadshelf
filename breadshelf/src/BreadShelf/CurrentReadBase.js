import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DoneIcon from '@material-ui/icons/Done';
import './CurrentRead.css';

class CurrentReadBase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            book: props.book,
            hasBook: props.hasBook
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ book: props.book, hasBook: props.hasBook });
    }

    doneClicked = () => {
        this.props.moveCurrentToDone();
    }

    moveToWillClicked = () => {
        this.props.moveCurrentToWill();
    }

    render() {
        const paperStyle = {
            backgroundColor: ' rgba(199, 152, 210, 0.5)',
            overflow: 'hidden'
        };

        const headerStyle = {
            padding: '0.25rem',
            paddingBottom: '0rem',
            paddingLeft: '2rem'
        };

        return (
            <div className="CurrentRead" >
                <Paper style={paperStyle}>
                    <Typography variant="h6" style={headerStyle}>Current Read</Typography>
                    <div style={{display: 'flex'}}>
                        <div style={{width: '100%', marginRight: '1rem', marginLeft: '1rem'}}>
                            <IconButton style={{
                                    display: 'inline', 
                                    float: 'left',
                                    minWidth: '47px',
                                    maxWidth: '48px'
                                }}
                                disabled={!this.state.hasBook}
                                onClick={this.moveToWillClicked}>
                                <ArrowDownwardIcon />
                            </IconButton>
                            <div style={{
                                    display: 'inline-block',
                                    margin: '0',
                                    marginLeft: '1rem',
                                    position: 'relative',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    msTransform: 'translateY(-50%)'
                                }}>
                                <Typography 
                                    variant="subtitle1" 
                                    style={{display: 'inline-block', marginRight: '1rem'}}>
                                    {this.state.hasBook ? this.state.book.title : "No Current Book"}
                                </Typography>
                                <Typography variant="subtitle2"
                                    style={{display: 'inline-block'}}>
                                    {this.state.hasBook ? this.state.book.author : "Get Reading!"}
                                </Typography>
                            </div>
                            <IconButton style={{
                                    display: 'inline', 
                                    float: 'right',
                                    minWidth: '47px',
                                    maxWidth: '48px'
                                }}
                                disabled={!this.state.hasBook}
                                onClick={this.doneClicked}>
                                <DoneIcon />
                            </IconButton>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }

}

export default CurrentReadBase;