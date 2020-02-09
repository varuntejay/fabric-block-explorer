import React, { Component } from 'react';
import './style.css'
import axios from 'axios';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdRefresh
} from "react-icons/md";
import {
    Tooltip
} from '@material-ui/core';

export default class Content extends Component {
    constructor() {
        super();
        this.state = {
            blocksHeight: 0,
            blocksDetails: [],
            trasactionDetailsMarkup: "",
            // peersCount: 0,
            // chaincodesCount: 0,
            row: ""
        }
    }

    componentDidMount() {
        this.refreshBlockDetails();
    }

    refreshBlockDetails = async () => {
        try {
            // this.getPeersCount();
            // this.getChaincodesCount();
            let blocksHeight = await this.getBlockHeight();
            let fromBlockNumber = blocksHeight - 1;
            let toBlockNumber = (fromBlockNumber > 9) ? (fromBlockNumber - 9) : 0
            let blocksDetails = await this.getBlockDetails(fromBlockNumber, toBlockNumber)
            this.prepareBlockTableMarkup(blocksDetails);
            this.setState({
                blocksHeight: blocksHeight,
                blocksDetails: blocksDetails,
                fromBlockNumber: fromBlockNumber,
                toBlockNumber: toBlockNumber
            })
        } catch (err) {
            alert(err)
        }
    }


    // handleAccordion = (event) => {
    //     console.log(event.target.value)
    //     this.setState({ row: event.target.value })
    // }

    prepareBlockTableMarkup(blocksDetails) {

        let markup = []
        blocksDetails.forEach((block) => {
            markup.push(
                <tr className="dataBorderBottom">
                    <td>{block.blockNumber}</td>
                    <td>{block.trnxnCount}</td>
                    <td>{block.dataHash}</td>
                    <td>
                        <button type="button" style={{ padding: '5px' }} value={JSON.stringify(block)} onClick={this.prepareBlockDetailsMarkup}>Fetch</button>
                    </td>
                </tr>
            )
        })
        this.setState({ blockDetailsMarkup: markup })
    }

    getBlockHeight = () => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('http://localhost:9086/getBlocks/height')
                    .then((response) => {
                        console.log(response)
                        if (response.data.status) {
                            resolve(response.data.blocksHeight);
                        } else {
                            throw new Error('Failed to get block height')
                        }
                    })
            } catch (err) {
                reject(err);
            }
        })
    }

    getPeersCount = () => {
        try {
            axios.post('http://localhost:9086/getPeersCount')
                .then((response) => {
                    console.log(response)
                    if (response.data.status) {
                        this.setState({ peersCount: response.data.peersCount });
                    } else {
                        throw new Error('Failed to get peer count')
                    }
                })
        } catch (err) {
            alert(err);
        }
    }

    getChaincodesCount = () => {
        try {
            axios.post('http://localhost:9086/getChaincodesCount')
                .then((response) => {
                    console.log(response)
                    if (response.data.status) {
                        this.setState({ chaincodesCount: response.data.chaincodesCount });
                    } else {
                        throw new Error('Failed to get peer count')
                    }
                })
        } catch (err) {
            alert(err);
        }
    }

    getBlockHeight = () => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('http://localhost:9086/getBlocks/height')
                    .then((response) => {
                        console.log(response)
                        if (response.data.status) {
                            resolve(response.data.blocksHeight);
                        } else {
                            throw new Error('Failed to get block height')
                        }
                    })
            } catch (err) {
                reject(err);
            }
        })
    }

    getBlockDetails = (fromBlockNumber, toBlockNumber) => {
        return new Promise((resolve, reject) => {
            try {
                let params = {
                    fromBlockNumber: fromBlockNumber,
                    toBlockNumber: toBlockNumber
                }
                axios.post('http://localhost:9086/getBlocks/details', params)
                    .then((response) => {
                        console.log(response)
                        if (response.data.status) {
                            resolve(response.data.blocksDetails);
                        } else {
                            throw new Error('Failed to get block height')
                        }
                    })
            } catch (err) {
                reject(err);
            }
        })
    }

    prepareBlockDetailsMarkup = (event) => {
        let blockDetails = JSON.parse(event.target.value);
        console.log(blockDetails);        
        let markup = [];
        (blockDetails.trnxns).forEach((txn) => {
            let endorsements = [];
            if(txn.payload.hasOwnProperty('data')) {
                if (txn.payload.data.hasOwnProperty('actions')) {
                    if (txn.payload.data.actions.length > 0) {
                        (txn.payload.data.actions[0].payload.action.endorsements).forEach((endorsement) => {
                            endorsements.push(endorsement.endorser.Mspid)
                        })
                    } 
                }
            }            
            markup.push(
                <table>
                    <tbody>
                        <tr>
                            <td> Block number</td>
                            <td>{blockDetails.blockNumber}</td>
                        </tr>
                        <tr>
                            <td> Transaction Id</td>
                            <td>{txn.payload.header.channel_header.tx_id}</td>
                        </tr>
                        <tr>
                            <td> Timestamp</td>
                            <td>{txn.payload.header.channel_header.timestamp}</td>
                        </tr>
                        <tr>
                            <td> Channel Id</td>
                            <td>{txn.payload.header.channel_header.channel_id}</td>
                        </tr>
                        <tr>
                            <td> Transaction creator Mspid</td>
                            <td>{txn.payload.header.signature_header.creator.Mspid}</td>
                        </tr>
                        {endorsements.length > 0 ?
                            <tr>
                                <td> Transaction endorsements</td>
                                <td>{endorsements.join(', ')}</td>
                            </tr> : 'NA'
                        }
                    </tbody>
                </table>
            )
        })
        this.setState({trasactionDetailsMarkup: markup})
    }

    fetchNext = async () => {
        let fromBlockNumber = (this.state.fromBlockNumber > 9) ? (this.state.fromBlockNumber - 10) : this.state.fromBlockNumber;
        let toBlockNumber = (fromBlockNumber > 9) ? (fromBlockNumber - 9) : 0
        let blocksDetails = await this.getBlockDetails(fromBlockNumber, toBlockNumber)
        this.prepareBlockTableMarkup(blocksDetails);
        this.setState({
            blocksDetails: blocksDetails,
            fromBlockNumber: fromBlockNumber,
            toBlockNumber: toBlockNumber
        })
    }

    fetchPrev = async () => {
        let fromBlockNumber = (this.state.blocksHeight > 9) ? (this.state.fromBlockNumber + 10) : this.state.blocksHeight - 1;
        let toBlockNumber = (fromBlockNumber > 9) ? (fromBlockNumber - 9) : 0
        let blocksDetails = await this.getBlockDetails(fromBlockNumber, toBlockNumber)
        this.prepareBlockTableMarkup(blocksDetails);
        this.setState({
            blocksDetails: blocksDetails,
            fromBlockNumber: fromBlockNumber,
            toBlockNumber: toBlockNumber
        })
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ justifyContent: 'center', width: '68%', marginLeft: '15px' }}>
                    <div className="navigator">
                        <div style={{ float: 'left', paddingLeft: '15px' }}>
                            <span style={{ fontSize: '30px' }}>{this.state.blocksHeight}&nbsp;</span>
                            <span style={{ fontSize: '20px' }}>Blocks</span>
                        </div>
                        <div style={{ float: 'right', display: 'flex' }}>
                            <Tooltip title="Refresh" onClick={this.refreshBlockDetails}>
                                <div style={{ padding: '10px', color: '#ffffff' }}>
                                    <MdRefresh style={{ fontSize: '25px' }} />
                                </div>
                            </Tooltip>
                            <div style={{ borderLeft: '0.5pt solid black' }}></div>


                            <Tooltip title="Prev" onClick={this.fetchPrev} disabled={(this.state.blocksHeight == this.state.fromBlockNumber + 1)}>
                                <div style={{ padding: '10px', color: '#ffffff' }}>
                                    <MdKeyboardArrowLeft style={{ fontSize: '25px' }} />
                                </div>

                            </Tooltip>
                            <Tooltip title="Next" onClick={this.fetchNext} disabled={(this.state.toBlockNumber == 0)}>
                                <div style={{ padding: '10px', color: '#ffffff' }}>
                                    <MdKeyboardArrowRight style={{ fontSize: '25px' }} />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <table>
                        <tbody>
                            <tr className="borderBottom">
                                <th>Block Number</th>
                                <th>Number of Tx</th>
                                <th>Data Hash</th>
                                <th>Info</th>
                            </tr>
                            {/* {markup} */}
                            {this.state.blockDetailsMarkup}
                        </tbody>
                    </table>
                </div>
                <div style={{ width: '32%', marginLeft: '15px', marginRight: '15px', height: '100%' }}>
                    <div className="navigator">
                        <div style={{ float: 'left', fontSize: '20px', paddingLeft: '15px' }}>Block Information</div>
                    </div>
                    <div className="transactionDetails">
                        {this.state.trasactionDetailsMarkup}
                    </div>

                </div>
            </div>
        )
    }
}