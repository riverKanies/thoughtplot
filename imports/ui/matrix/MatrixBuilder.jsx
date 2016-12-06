import React, { Component, PropTypes } from 'react'

import RowBuilder from './RowBuilder.jsx'

export default class MatrixBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.currentStep = 0
    this.state.steps = [
      <RowBuilder {...this.props} />,
      <div>step 2</div>,
      <div>step 3</div>
    ]

    this.toPrevious = this.toPrevious.bind(this)
    this.toNext = this.toNext.bind(this)
  }

  render() {
    return(<div>
      <header>
        <h1>Matrix Builder</h1>
      </header>

      {this.state.currentStep > 0 ? <button onClick={this.toPrevious}>Previous</button> : ''}
      {this.state.steps[this.state.currentStep]}
      {this.state.currentStep < this.state.steps.length-1 ? <button onClick={this.toNext}>Next</button> : ''}
    </div>)
  }

  toPrevious() {
    this.setState({currentStep: this.state.currentStep - 1})
  }

  toNext() {
    this.setState({currentStep: this.state.currentStep + 1})
  }
}
