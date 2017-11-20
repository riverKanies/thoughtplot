import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'

export const decisionStyles = {
  width: '80%', height: '80px', fontSize: '1.5em'
}

export default class Decision extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.checkEnter = this.checkEnter.bind(this)
  }

  render() {
    return (<div style={{textAlign: 'center'}}>
      <StepTitle title='Decision' />
      <br/>
      <p>Describe your decision in a few words:</p>
      <textarea value={this.props.decision} onChange={this.props.onChangeDecision} placeholder="ex: How should my team document decisions?" style={decisionStyles} onKeyPress={this.checkEnter}/>
    </div>)
  }

  checkEnter (e) {
    if (e.which == 13 || e.keyCode == 13) this.props.toNext()
  }
}