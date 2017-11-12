import React, { Component, PropTypes } from 'react'
import colors from '../colors'

export default class StepTitle extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (<div style={{fontSize: '2em', background: colors.blue, color: 'white', textAlign: 'center', height: '40px', padding: '30px 0 20px', borderRadius: '18px 18px 0 0'}}>
        {this.props.title}
    </div>)
  }
}