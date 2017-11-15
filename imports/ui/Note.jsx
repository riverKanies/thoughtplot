import React, { Component, PropTypes } from 'react'
import colors from './colors'


export default class Note extends Component {
    render() {
        return (<div style={{marginBottom: '20px'}}>
            <div style={{width: '100%', height: '30px', background: colors.blue, borderRadius: '20px 20px 0 0', textAlign: 'center', padding: '10px 0'}}>
                <text style={{color: 'white'}}>{this.props.label}</text>
            </div>
            <div style={{padding: '0 5%', width: '90%', border: `1px solid ${colors.blue}`, borderRadius: '0 0 20px 20px', background: 'white'}}>
                <p>
                    {this.props.content}
                </p>
            </div>
        </div>)
    }
}