import React, { Component } from 'react';
import './style.css'

export default class AccordionTable extends Component {
    constructor() {
        super();
    }

    handleAccordion = (row) => {
        this.setState({ row: row })
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <table>
                    <tr className="border_bottom">
                        <th>Block number</th>
                        <th>Number of Tx</th>
                        <th>Data hash</th>
                        <th>Transaction details</th>
                    </tr>
                    {this.props.rows.forEach(block => {
                        <tr >
                            <td>{block.blockNumber}</td>
                            <td>{block.trnxnCount}</td>
                            <td>{block.dataHash}</td>
                            <td><button style={{ padding: '5px' }} onClick={this.handleAccordion(`row_${block.blockNumber}`)} /></td>
                        </tr>
                    })}
                </table>
            </div>
        )
    }
}