import React, { Component, PropTypes } from 'react'

import Decision from './Decision.jsx'
import RowBuilder from './RowBuilder.jsx'
import ColumnBuilder from './ColumnBuilder.jsx'
import CellBuilder from './CellBuilder.jsx'


export default class MatrixBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.currentStep = 0

    this.toPrevious = this.toPrevious.bind(this)
    this.toNext = this.toNext.bind(this)
    this.toStep = this.toStep.bind(this)
  }

  render() {
    const steps = [
      <Decision {...this.props} />,
      <RowBuilder {...this.props} />,
      <ColumnBuilder {...this.props} />,
      <CellBuilder {...this.props} />,
    ]

    return(<div>
      <header>
        <h1>Matrix Builder</h1>
      </header>
      <p>Follow these {steps.length} steps to document your decision:</p>
      <p>
        Step {this.state.currentStep+1}:
        <button disabled={this.state.currentStep > 0 ? false : true} onClick={this.toPrevious}>Previous</button>
        {this.renderNextButton(steps)}
      </p>
      <div style={{border: '2px solid lightgray', borderRadius: '20px', padding: '10px'}}>
        {steps[this.state.currentStep]}
      </div>
      <br/>
      {this.renderNextButton(steps)}
    </div>)
  }

  renderNextButton(steps) {
    return <button disabled={this.state.currentStep < steps.length-1 ? false : true} onClick={this.toNext}>Next</button>
  }

  toPrevious() {
    this.setState({currentStep: this.state.currentStep - 1})
  }

  toNext() {
    this.setState({currentStep: this.state.currentStep + 1})
  }

  toStep(step) {
    return () => {
      this.setState({currentStep: step})
    }
  }
}
