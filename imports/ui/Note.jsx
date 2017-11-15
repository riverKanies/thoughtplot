import React, { Component, PropTypes } from 'react'
import colors from './colors'


export default class Note extends Component {
    render() {
        return (<div style={{marginBottom: '20px'}}>
            <div style={{width: '100%', height: '30px', background: colors.blue, borderRadius: '20px 20px 0 0', textAlign: 'center', paddingTop: '10px'}}>
                <text style={{color: 'white'}}>{this.props.label}</text>
            </div>
            <div style={{paddingBottom: '1px', width: '100%', borderRadius: '0 0 20px 20px', background: colors.blue}}>
                <div style={{margin: '0 1px', borderRadius: '0 0 19px 19px', background: 'white', padding: '10px 20px'}}>
                    <p style={{margin: '0px'}}>
                        {this.props.content}
                    </p>
                </div>
            </div>
        </div>)
    }
}