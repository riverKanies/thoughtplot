import React, { Component, PropTypes } from 'react'

export default class RowBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.onAddRow = this.onAddRow.bind(this)
    this.acceptRow = this.acceptRow.bind(this)
    this.cancelRow = this.cancelRow.bind(this)
  }

  renderRowBuilder() {
    if (this.state.buildingRow != true) {
      return (
        <div>
          <button onClick={this.onAddRow}>Add Option</button>
          <button onClick={this.cancelRow}>Delete Last Option</button>
          <text>(the last option is in the bottom row of the plot)</text>
        </div>
      )
    }
    const rowNum = this.props.mtx.length - 1
    return (
      <div>
        <label>New Option:</label>
        <input value={this.props.mtx[rowNum][0].val} onChange={this.props.onChangeHandler(rowNum, 0)} onClick={(e)=>e.target.select()}/>
        <br/>
        <button onClick={this.acceptRow}>Done</button>
        <button onClick={this.cancelRow}>Cancel</button>
      </div>
    )
  }

  render() {
    return (<div>
      <p><b>Add Options</b><br/>What are the (3) options you're considering. You should add an option (row) for each.</p>
      <label>Current Options</label>
      <ol>
        {this.props.mtx.map((row, i) => {
          if (i==0) return ''
          return <li key={i}>{row[0].val}</li>
        })}
      </ol>
      {this.renderRowBuilder()}
    </div>)
  }

  onAddRow() {
    const { mtx } = this.props
    const newRow = []
    mtx[0].forEach((col, i) => {
      const val = (i==0) ? "ThotPlot" : 0
      newRow.push({val: val})
    })
    mtx.push(newRow)
    this.setState({buildingRow: true})
    this.props.changeMatrix(mtx)
  }

  acceptRow() {
    this.setState({buildingRow: false})
  }
  cancelRow() {
    const {mtx} = this.props
    if(mtx.length < 2) return
    mtx.pop()
    this.setState({buildingRow: false})
    this.props.changeMatrix(mtx)
  }
}
