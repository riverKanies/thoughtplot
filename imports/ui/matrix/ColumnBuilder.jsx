import React, { Component, PropTypes } from 'react'

export default class ColumnBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.addColumn = this.addColumn.bind(this)
  }

  renderBuilder() {
    if (this.state.buildingColumn != true) return <button onClick={this.addColumn}>Add Column</button>
    const colNum = this.props.mtx[0].length-1
    return (<div key={colNum}>
      <label>Variable Name:</label>
      <input value={this.props.mtx[0][colNum]} onChange={this.props.onChangeHandler(0,colNum)} />
    </div>)
  }

  render() {
    return (<div>
      column builder:
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
}
