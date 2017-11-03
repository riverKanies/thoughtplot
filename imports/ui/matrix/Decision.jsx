import React, { Component, PropTypes } from 'react'

export default class Decision extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (<div>
      <b>Decision:</b><br/><br/>
      <textarea value={this.props.decision} onChange={this.props.onChangeDecision} placeholder="How should my team document decisions?" style={{
        width: '100%', height: '100px', margin: '10px 0', fontSize: '1.5em'
      }}/>
    </div>)
  }
}
