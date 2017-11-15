import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'

export const decisionStyles = {
  width: '90%', height: '80px', fontSize: '1.5em'
}

export default class Decision extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (<div style={{textAlign: 'center'}}>
      <StepTitle title='Decision' />
      <br/>
      <p>State a decision that you're struggling with as a question:</p>
      <textarea value={this.props.decision} onChange={this.props.onChangeDecision} placeholder="ex: How should my team document decisions?" style={decisionStyles}/>
    </div>)
  }
}