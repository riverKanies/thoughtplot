import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js'

import MatrixBuilder from './matrix/MatrixBuilder.jsx'
import Task from './Task.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.decision = "which team chat tool?"
    this.state.mtx = [
      [null, 'price', 'usability'],
      ['slack', 5, 8],
      ['IRC', 10, 5]
    ]
    this.state.isWeightedMtx = false
    this.state.weights = []

    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onChangeDecision = this.onChangeDecision.bind(this)
    this.changeMatrix = this.changeMatrix.bind(this)
    this.addWeights = this.addWeights.bind(this)
    this.removeWeights = this.removeWeights.bind(this)
    this.onChangeWeightHandler = this.onChangeWeightHandler.bind(this)
  }

  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ))
  }

  renderLabelRow() {
    const labelRow = this.state.mtx[0].concat([`Score${this.state.isWeightedMtx ? ' (weighted)' : ''}`])
    //if (this.state.isWeightedMtx) labelRow.push('Weighted')
    return <tr>{this.renderRow(labelRow,0)}</tr>
  }

  renderOptionRows() {
    //console.log('state', this.state)
    this.scores = []
    const bestI = this.bestOption(this.state.mtx).index
    return this.state.mtx.slice(1).map((row, i) => {
      //console.log('row', row, i)
      const score = this.scoreRow(row)
      let rowScored = row.concat(score)
      this.scores.push(score)
      const styles = (bestI == i) ? {background: "yellow"} : {}
      return <tr key={i} style={styles}>{this.renderRow(rowScored,i+1)}</tr>
    })
  }

  renderRow(row,i) {
    return row.map((cell, j) => (
      <td key={j}>{this.renderCell(cell,i,j)}</td>
    ))
  }

  renderCell(val,i,j) {
    if (val === null) return
    if (j >= this.numColumns()) return val
    return <span><input value={val} onChange={this.onChangeHandler(i,j)}/>
      {this.state.isWeightedMtx && i==0 ? 'wght' : ''}
      {this.state.isWeightedMtx && j>0 && i>0 ? (val * this.state.weights[j]) : ''}
    </span>
  }

  renderWeightsRow() {
    if (!this.state.isWeightedMtx) return <tr><td><button onClick={this.addWeights}>Add Weights</button></td></tr>
    return <tr>{this.state.mtx[0].map((label, i) => {
      if (label == null) return <td key='0'>Weights<button onClick={this.removeWeights}>X</button></td>
      return <td key={i}><input value={this.state.weights[i]} onChange={this.onChangeWeightHandler(i)}/></td>
    })}</tr>
  }

  render() {
    const bestOption = this.bestOption(this.state.mtx)
    return (
      <div className="container">
        <header>
          <h1>Introduction to the Decision Documentation Tool (DDT)</h1>
        </header>
        <p>
        Welcome to the DDT. This tool will walk you through making a decision matrix.
         A decision matrix is a useful tool for documenting reasoning used to make a decision.
          Basically, you will create a table of options vs. variables, then score each option by summing the values for each variable.
           When you're done, one option should have the highest score, indicating that you think it is the best.
            The DDT can be helpful for making decisions, but its main purpose is for communicating decisions to your peers and/or partners, whoever will be affected by the decision.
             Documenting critical design and process related decisions using the DDT will help to get everyone on the same page and working efficiently together.
        </p>
        <p>
        Using the DDT in no way guarantees that everyone will agree on which option is best.
         However, decision matricies can be compared to reveal where critical discrepencies in reasoning are, which can help to facilitate a discussion about the decision.</p>

        <MatrixBuilder
          decision={this.state.decision}
          mtx={this.state.mtx}
          onChangeHandler={this.onChangeHandler}
          changeMatrix={this.changeMatrix}
          onChangeDecision={this.onChangeDecision} />

        <header>
          <h1>Decision</h1>
        </header>
        <textarea value={this.state.decision} onChange={this.onChangeDecision}/>

        <header>
          <h1>Matrix</h1>
        </header>
        <table>
          <tbody>
            {this.renderLabelRow()}
            {this.renderOptionRows()}
            {this.renderWeightsRow()}
          </tbody>
        </table>
        <b>Best: {bestOption.option}, Score: {bestOption.score}</b>

        <header>
          <h1>Todo List</h1>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }

  addWeights() {
    const weights = this.state.mtx[0].map(() => (1))
    this.setState({isWeightedMtx: true, weights: weights})
  }

  removeWeights() {
    this.setState({isWeightedMtx: false})
  }

  changeMatrix(mtx) {
    const {weights} = this.state
    if (this.state.weights.length < mtx[0].length) weights.push(1)
    this.setState({mtx: mtx, weights: weights})
  }

  onChangeHandler(i,j) {
    return (e) => {
      const { mtx } = this.state
      mtx[i][j] = e.target.value
      this.setState(mtx: mtx)
    }
  }

  onChangeDecision(e) {
    this.setState({decision: e.target.value})
  }

  onChangeWeightHandler(i) {
    return (e) => {
      const { weights } = this.state
      weights[i] = e.target.value
      this.setState({weights: weights})
    }
  }

  numColumns() {
    return this.state.mtx[0].length
  }

  scoreRow(row) {
    return !this.state.isWeightedMtx ?
      row.slice(1).reduce((a,b) => (parseInt(a)+parseInt(b)), 0) :
      row.slice(1).reduce((a,b,j) => (parseInt(a)+parseInt(b)*this.state.weights[j+1]), 0)
  }

  bestOption(mtx) {
    if (mtx.length < 2) return {}
    const scored = mtx.slice(1).map((row, i) => {
      const score = this.scoreRow(row)
      return {option: row[0], index: i, score: score}
    })
    return scored.reduce((a,b) => {
      if (a.score > b.score) return a
      return b
    })
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
}

export default createContainer(() => {
  return {
    tasks: Tasks.find({}).fetch(),
  }
}, App)
