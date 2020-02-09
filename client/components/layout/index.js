import React, { Component } from 'react';
import Header from '../header';
import Content from '../content';
import './style.css'

export default class Layout extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div style={{ height: '100%', margin: '-8px'}}>
                <Header></Header>
                <div className="content">
                    <Content />
                </div>
            </div>
        )
    }
}