import React, { Component, PropTypes } from 'react'
import colors from './colors'


export default class Note extends Component {
    render() {
        return (<div style={{border: `1px solid ${colors.blue}`, borderRadius: '20px', marginBottom: '20px', background: 'white'}}>
            <div style={{width: '100%', height: '30px', background: colors.blue, borderRadius: '19px 19px 0 0', textAlign: 'center', padding: '10px 0'}}>
                <text style={{color: 'white'}}>{this.props.label}</text>
            </div>
            <div style={{padding: '0 5%', width: '90%'}}>
                <p>
                    {this.props.content}
                </p>
            </div>
        </div>)
    }
}