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
          <button onClick={this.onAddRow}>Add Row</button>
          <button onClick={this.cancelRow}>Delete Last Row</button>
        </div>
      )
    }
    const rowNum = this.props.mtx.length - 1
    return (
      <div>
        {this.props.mtx[0].map((col, i) => {
          return <div key={i}>
            <label>{col == null ? "option" : col}</label>
            <input value={this.props.mtx[rowNum][i]} onChange={this.props.onChangeHandler(rowNum, i)}/>
          </div>
        })}
        <button onClick={this.acceptRow}>Done</button>
        <button onClick={this.cancelRow}>Cancel</button>
      </div>
    )
  }

  render() {
    return (<div>
      {this.renderRowBuilder()}
    </div>)
  }

  onAddRow() {
    const { mtx } = this.props
    const newRow = []
    mtx[0].forEach(() => {
      newRow.push(0)
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
