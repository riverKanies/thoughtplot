import React, { Component, PropTypes } from 'react'

export default class ColumnBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.addColumn = this.addColumn.bind(this)
    this.acceptColumn = this.acceptColumn.bind(this)
    this.cancelColumn = this.cancelColumn.bind(this)
  }

  renderBuilder() {
    if (this.state.buildingColumn != true) {
      return (<div>
        <button onClick={this.addColumn}>Add Column</button>
        <button onClick={this.cancelColumn}>Delete Column</button>
      </div>)
    }
    const colNum = this.props.mtx[0].length-1
    return (<div key={colNum}>
      <label>Variable Name:</label>
      <input value={this.props.mtx[0][colNum]} onChange={this.props.onChangeHandler(0,colNum)} onClick={(e)=>e.target.select()} />
      <button onClick={this.acceptColumn}>Done</button>
      <button onClick={this.cancelColumn}>Cancel</button>
    </div>)
  }

  render() {
    return (<div>
      <p><b>Column Builder</b>: Columns are for variables relevant to your decision. You should add a column for each main area in which your options differ significantly.</p>
      {this.renderBuilder()}
    </div>)
  }

  addColumn() {
    const { mtx } = this.props
    mtx.map((row) => {
      return row.push(0)
    })
    this.props.changeMatrix(mtx)
    this.setState({buildingColumn: true})
  }

  acceptColumn() {
    this.setState({buildingColumn: false})
  }

  cancelColumn() {
    const { mtx } = this.props
    if (mtx[0].length < 2) return
    mtx.map((row) => {
      return row.pop()
    })
    this.props.changeMatrix(mtx)
    this.setState({buildingColumn: false})
  }
}
