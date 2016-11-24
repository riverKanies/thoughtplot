import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js'

import Task from './Task.jsx'

class App extends Component {
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ))
  }

  renderLabelRow() {
    const labelRow = [' '].concat(this.variables())
    labelRow.push('score')
    return <tr>{this.renderRow(labelRow)}</tr>
  }

  renderRows() {
    return this.options().map((opt, i) => {
      const score = opt.vals.reduce((a,b) => (a+b), 0)
      const row = [opt.name].concat(opt.vals).concat(score)
      return <tr key={i}>{this.renderRow(row)}</tr>
    })
  }

  renderRow(row) {
    return row.map((cell, i) => (
      <td key={i}>{cell}</td>
    ))
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
            {this.renderRows()}
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

  variables() {
    return ['price', 'usability']
  }

  options() {
    return [
      {name: 'slack', vals: [5, 8]},
      {name: 'IRC', vals: [10, 5]}
    ]
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
