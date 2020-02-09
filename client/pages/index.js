import React,{ Component } from 'react';
import Layout from '../components/layout';

export default class Index extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
    }
    render() {
        return (
            <Layout>
                <div style={{height:'100%'}}>                
                     <div style={{width:'400px', position: 'relative', margin:'auto', top: 'calc(100%-60%)'}}>
                         <div style={{fontFamily:'Open Sans', textAlign:'center', fontSize:'26px', fontWeight:'300', color: '#545454'}}> Welcome to Home Page!</div>
                     </div>
                </div>            
            </Layout>
        )
    }
}