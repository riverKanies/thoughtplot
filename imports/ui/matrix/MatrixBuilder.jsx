import React, { Component, PropTypes } from 'react'

import Decision from './Decision.jsx'
import RowBuilder from './RowBuilder.jsx'
import ColumnBuilder from './ColumnBuilder.jsx'
import CellBuilder from './CellBuilder.jsx'
import colors from '../colors'

const styles = {fontSize: '2em', backgroundColor: 'white', border: `2px solid ${colors.blue}`, color: colors.blue, borderRadius: '7px'}

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

    const endOfSteps = this.state.currentStep < steps.length-1

    return(<div>
      <header>
        <h1>Plot Builder</h1>
      </header>
      <p>Follow these {steps.length} steps to document your decision:</p>
      <p>
        Step {this.state.currentStep+1}:
        <button disabled={this.state.currentStep > 0 ? false : true} onClick={this.toPrevious}>&#8678;</button>
        <button disabled={this.state.currentStep < steps.length-1 ? false : true} onClick={this.toNext}>&#8680;</button>
      </p>
      <div style={{border: '2px solid lightgray', borderRadius: '20px', padding: '5%'}}>
        {steps[this.state.currentStep]}
      </div>
      <br/>
      <div style={{textAlign: 'center'}}>
        {endOfSteps
          ? <button onClick={this.toNext} style={styles}>Next Step &#8680;</button>
          : <button onClick={this.props.setTab('matrix')} style={styles}>Skip to Plot &#8680;</button>
        }
      </div>
    </div>)
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
