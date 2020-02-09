import React,{ Component } from 'react';
import './style.css'

export default class Header extends Component {
    constructor() {
        super();
    }
    render() {
        return(
            <div id="header">                
                <div id="titleHolder">Hyperledger Fabric Block Explorer</div>
            </div>
        )
    }
}