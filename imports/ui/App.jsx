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

    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onChangeDecision = this.onChangeDecision.bind(this)
    this.changeMatrix = this.changeMatrix.bind(this)
  }

  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ))
  }

  renderLabelRow() {
    const labelRow = this.state.mtx[0].concat(['score'])
    return <tr>{this.renderRow(labelRow,0)}</tr>
  }

  renderOptionRows() {
    //console.log('state', this.state)
    this.scores = []
    const bestI = this.bestOption(this.state.mtx).index
    return this.state.mtx.slice(1).map((row, i) => {
      //console.log('row', row, i)
      const score = row.slice(1).reduce((a,b) => (parseInt(a)+parseInt(b) ), 0)
      const rowScored = row.concat(score)
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
    if (j === this.numColumns()) return val
    return <input value={val} onChange={this.onChangeHandler(i,j)}/>
  }

  render() {
    const bestOption = this.bestOption()
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
            The DDT can be helpful for making decisions, but it's main purpose is for communicating decisions to your peers and/or partners, whoever will be affected by the decision.
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
        <textarea value={this.state.decision}
          style={{width: "200px"}}
          onChange={this.onChangeDecision}/>

        <header>
          <h1>Matrix</h1>
        </header>
        <table>
          <tbody>
            {this.renderLabelRow()}
            {this.renderOptionRows()}
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

  changeMatrix(mtx) {
    this.setState({mtx: mtx})
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

  numColumns() {
    return this.state.mtx[0].length
  }

  bestOption(mtx) {
    const scored = this.state.mtx.slice(1).map((row, i) => {
      const score = row.slice(1).reduce((a,b) => (parseInt(a)+parseInt(b) ), 0)
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
