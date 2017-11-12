import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'

export const decisionStyles = {
  width: '90%', height: '100px', fontSize: '1.5em'
}

export default class Decision extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (<div style={{textAlign: 'center'}}>
      <StepTitle title='Decision' />
      <br/><br/>
      <textarea value={this.props.decision} onChange={this.props.onChangeDecision} placeholder="How should my team document decisions?" style={decisionStyles}/>
    </div>)
  }
}