import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js'

import Task from './Task.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.mtx = [
      [null, 'price', 'usability'],
      ['slack', 5, 8],
      ['IRC', 10, 5]
    ]

    this.onAddRow = this.onAddRow.bind(this)
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
    return this.state.mtx.slice(1).map((row, i) => {
      //console.log('row', row, i)
      const score = row.slice(1).reduce((a,b) => (parseInt(a)+parseInt(b) ), 0)
      const rowScored = row.concat(score)
      return <tr key={i}>{this.renderRow(rowScored,i+1)}</tr>
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

  renderRowBuilder() {
    if (this.state.buildingRow != true) return <button onClick={this.onAddRow}>Add Row</button>
    const rowNum = this.state.mtx.length - 1
    return (
      <div>
        {this.state.mtx[0].map((col, i) => {
          return <div key={i}>
            <label>{col == null ? "option" : col}</label>
            <input value={this.state.mtx[rowNum][i]} onChange={this.onChangeHandler(rowNum, i)}/>
          </div>
        })}
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Matrix Builder</h1>
        </header>

        {this.renderRowBuilder()}

        <header>
          <h1>Matrix</h1>
        </header>

        <table>
          <tbody>
            {this.renderLabelRow()}
            {this.renderOptionRows()}
          </tbody>
        </table>

        <header>
          <h1>Todo List</h1>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }

  onChangeHandler(i,j) {
    return (e) => {
      const { mtx } = this.state
      mtx[i][j] = e.target.value
      this.setState(mtx: mtx)
    }
  }

  onAddRow() {
    const { mtx } = this.state
    const newRow = []
    mtx[0].forEach(() => {
      newRow.push(0)
    })
    mtx.push(newRow)
    this.setState({buildingRow: true, mtx: mtx})
  }

  numColumns() {
    return this.state.mtx[0].length
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
