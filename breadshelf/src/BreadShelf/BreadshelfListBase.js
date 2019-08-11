import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { ListItem } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import Book from '../Components/Book';
import AddBook from '../Components/AddBook';
import './BreadshelfList.css';

class BreadshelfListBase extends Component {
    constructor(props) {
        super(props);

        this.willReadState = {
            paperColor: 'rgba(79, 255, 105, 0.5)',
            floatDirection: 'left',
            tenseTitle: 'Will Read'
        }

        this.haveReadState = {
            paperColor: 'rgba(66, 230, 255, 0.5)',
            floatDirection: 'right',
            tenseTitle: 'Have Read'
        }

        this.state = {
            books: [
                { title: "Thinking Fast, and Slow", author: "Daniel Khaneman" },
                { title: "The Republic", author: "Plato" },
                { title: "The Innovator's DNA", author: "Clayton Christenson" },
                { title: "Beyond Freedom & Dignity", author: "B.F. Skinner" },
                { title: "A Speck in the Sea", author: "Johnny Aldridge" },
                { title: "Closer to Shore", author: "Michael Capuzzo" },
                { title: "The Four", author: "Scott Galloway" },
                { title: "Steve Jobs", author: "Walter Isaacson" },
                { title: "The Gulag Archipelago Vol. 1", author: "Aleksandr Solzhenitsyn" },
                { title: "Bad Blood", author: "John Carreyrou" },
                { title: "12 Rules for Life", author: "Jordan Peterson" },
                { title: "Algorthims to Live By", author: "Brian Christian" }
            ]
        };

        if(this.props.tense === "will") {
            this.state = { ...this.state, ...this.willReadState };
        } else {
            this.state = { ...this.state, ...this.haveReadState };
        }

    }

    render() {

        const paperStyle = {
            backgroundColor: this.state.paperColor,
            height: '100%',
            overflow: 'hidden'
        };

        const headerStyle = {
            padding: '0.25rem',
            paddingBottom: '0rem',
            paddingLeft: '2rem',
            color: '#4e4e4e',
            borderBottom: '1px solid rgba(0,0,0,0.12)'
        };

        return (
            <div className="BreadshelfList" style={{float: this.state.floatDirection}}>
                <Paper style={paperStyle}>
                    <Typography variant="h6" style={headerStyle}>{this.state.tenseTitle}</Typography>
                    <Scrollbars
                        autoHide
                        autoHideTimeout={1000}
                        autoHideDuration={500}
                        className="Scrollbar"
                        >
                        <List style={{marginRight: '0.25rem', marginLeft: '0.25rem', paddingTop: '0'}}>
                            {
                                this.state.books.map((book, index) => {
                                    return (
                                        <div key={index}>
                                            <ListItem>
                                                <Book title={book.title} author={book.author} willRead={this.props.tense === "will"}/>
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    );
                                })
                            }
                        </List>
                        <AddBook />
                    </Scrollbars>
                </Paper>
            </div>
        );
    }
}

export default BreadshelfListBase;