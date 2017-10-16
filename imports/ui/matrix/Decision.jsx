import React, { Component, PropTypes } from 'react'

export default class Decision extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (<div>
        <p><b>Decision</b><br/>Describe your decision in a few words (as a question).</p>
      <textarea value={this.props.decision} onChange={this.props.onChangeDecision} placeholder="Which decision-making-tool should I use?"/>
    </div>)
  }
}
