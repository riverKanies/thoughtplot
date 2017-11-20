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

    this.toNext = this.toNext.bind(this)
    this.toStep = this.toStep.bind(this)
  }

  render() {
    const steps = [
      <Decision {...this.props} toNext={this.toNext}/>,
      <RowBuilder {...this.props} />,
      <ColumnBuilder {...this.props} />,
      <CellBuilder {...this.props} />,
    ]

    const endOfSteps = this.props.currentStep < steps.length-1

    let error = null

    return(<div>
      <header>
        <h1 style={{color: colors.blue, textAlign: 'center'}}>Plot Builder</h1>
      </header>
      <p style={{textAlign: 'center'}}>Follow these {steps.length} steps to document your decision:</p>
      <div style={{marginBottom: '-30px', textAlign: 'center'}}>
        {steps.map((s, i)=>{
          if (!error) error = this.validateStep(i-1)
          const curStep = i == this.props.currentStep
          const styles = {
            background: curStep ? colors.blue : 'white',
            color: !error ? (curStep ? 'white':'black'): 'lightgray',
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
      <div style={{border: '1px solid lightgray', borderRadius: '20px', padding: '0', paddingBottom: '20px'}}>
        {steps[this.props.currentStep]}
      </div>
      <br/>
      <div style={{textAlign: 'center'}}>
        <text style={{color: 'red'}}>{this.state.error}</text><br/>
        {endOfSteps
          ? <button onClick={this.toNext} style={!this.validateStep(this.props.currentStep) ? styles : {...styles, ...stylesDisabled}}>Next Step &#8680;</button>
          : <button onClick={this.props.setTab('matrix')} style={styles}>Skip to Plot &#8680;</button>
        }
      </div>
    </div>)
  }

  toNext() {
    const error = this.validateStep(this.props.currentStep)
    if (error) {
      this.setState({error})
    } else {
      this.setState({error})
      this.props.onChangeStep(this.props.currentStep + 1)
    }
  }

  toStep(step) {
    return () => {
      this.setState({error: null})
      this.props.onChangeStep(step)
    }
  }

  validateStep(i) {
    const {decision, mtx} = this.props
    const regex = new RegExp(/\S\w*/)
    switch (i) {
      case 0:
        return (regex.exec(decision)) ? null : 'decision cannot be blank'
      case 1:
        return mtx.length > 1 ? null : 'You must have at least one option'
      case 2:
        return mtx[0].length > 1 ? null : 'You must have at least one consideration'
    }
    return null
  }
}
