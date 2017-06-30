import React, { Component, PropTypes } from 'react'

import Decision from './Decision.jsx'
import ColumnBuilder from './ColumnBuilder.jsx'
import RowBuilder from './RowBuilder.jsx'

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
      <ColumnBuilder {...this.props} />,
      <RowBuilder {...this.props} />,
      // <div><p><b>Scoring</b>: If there are any blank cells in your decision matrix fill them in now.
      //  Values you fill in should represent the relative importance of that variable for that option.
      //  It doesn't matter what scale you choose to use (0-1, 1-10, 1-100).
      //  The values you fill in are simply summed for each option to determine the final overall score for that option.
      //  However, if you choose to add weights (by clicking 'Add Weights' at the bottom of the matrix)
      //  each column will be multiplied by its weight value when summed for the final score (weighted values are shown to the right of the input value for each cell).</p></div>,
      // <div><p><b>Self Review</b>: Look over your matrix, paying special attention to the overall scores.
      //  Do the scores align with your intuition about which choice is best?
      //   If not, modify some of your scores to capture your intuition as best you can.
      //    Is there something relevant to the decision that you haven't yet made a column for?
      //     If so, add a column now (you'll have to go back to the
      //     <a onClick={this.toStep(1)} style={{color: "blue"}}> Column Builder</a> step). </p></div>
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
      {steps[this.state.currentStep]}
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
