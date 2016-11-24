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

  render() {
    return (
      <div className="container">
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
