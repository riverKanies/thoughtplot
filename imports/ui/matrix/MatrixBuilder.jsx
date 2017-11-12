import React, { Component, PropTypes } from 'react'

import Decision from './Decision.jsx'
import RowBuilder from './RowBuilder.jsx'
import ColumnBuilder from './ColumnBuilder.jsx'
import CellBuilder from './CellBuilder.jsx'
import colors from '../colors'

const styles = {fontSize: '2em', backgroundColor: 'white', border: `2px solid ${colors.blue}`, color: colors.blue, borderRadius: '7px'}
const stylesDisabled = {border: '2px solid lightgray', color: 'lightgray'}

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

    let error = null

    return(<div>
      <header>
        <h1>Plot Builder</h1>
      </header>
      <p>Follow these {steps.length} steps to document your decision:</p>
      <div style={{marginBottom: '-30px', textAlign: 'center'}}>
        {steps.map((s, i)=>{
          if (!error) error = this.validateStep(i-1)
          const styles = {
            background: i==this.state.currentStep ? colors.blue : 'white',
            color: !error ? 'black': 'lightgray',
            border: '2px solid lightgray',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            margin: '10px',
            fontSize: '1em'
          }
          return <button key={i} style={styles} onClick={this.toStep(i)} disabled={!!error}>{i+1}</button>
        })}
      </div>
      <div style={{border: '2px solid lightgray', borderRadius: '20px', padding: '0', paddingBottom: '20px'}}>
        {steps[this.state.currentStep]}
      </div>
      <br/>
      <div style={{textAlign: 'center'}}>
        <text style={{color: 'red'}}>{this.state.error}</text><br/>
        {endOfSteps
          ? <button onClick={this.toNext} style={!this.validateStep(this.state.currentStep) ? styles : {...styles, ...stylesDisabled}}>Next Step &#8680;</button>
          : <button onClick={this.props.setTab('matrix')} style={styles}>Skip to Plot &#8680;</button>
        }
      </div>
    </div>)
  }

  toPrevious() {
    this.setState({currentStep: this.state.currentStep - 1})
  }

  toNext() {
    const error = this.validateStep(this.state.currentStep)
    if (error) {
      this.setState({error})
    } else {
      this.setState({currentStep: this.state.currentStep + 1, error})
    }
  }

  toStep(step) {
    return () => {
      this.setState({currentStep: step, error: null})
    }
  }

  validateStep(i) {
    const {decision, mtx} = this.props
    switch (i) {
      case 0:
        return (decision.slice(-1) == '?') ? null : 'Your decision should end with a "?"'
      case 1:
        return mtx.length > 1 ? null : 'You must have at least one option'
      case 2:
        return mtx[0].length > 1 ? null : 'You must have at least one consideration'
    }
    return null
  }
}
