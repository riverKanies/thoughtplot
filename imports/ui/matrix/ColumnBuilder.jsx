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
        <button onClick={this.addColumn}>Add Consideration</button>
        <button onClick={this.cancelColumn}>Delete Last Consideration</button>
        <text>(the last consideration is in the right column while viewing the plot)</text>
      </div>)
    }
    const colNum = this.props.mtx[0].length-1
    return (<div key={colNum}>
      <label>New Consideration:</label>
      <input value={this.props.mtx[0][colNum].val} onChange={this.props.onChangeHandler(0,colNum)} onClick={(e)=>e.target.select()} />
      <button onClick={this.acceptColumn}>Done</button>
      <button onClick={this.cancelColumn}>Cancel</button>
    </div>)
  }

  render() {
    return (<div>
      <p>
        <b>Add Considerations</b><br/>
        What are the (3) most important considerations for your decision. You should add a consideration (column) for each main area in which your options differ significantly.
      </p>
      <label>Current Considerations</label>
      <ol>
        {this.props.mtx[0].map((labelObj, i) => {
          const label = labelObj.val
          if (i==0) return ''
          return <li key={i}>{label}</li>
        })}
      </ol>
      {this.renderBuilder()}
    </div>)
  }

  addColumn() {
    const { mtx } = this.props
    mtx.map((row, i) => {
      if (i==0) return row.push({val: "cost", note: ''})
      return row.push({val: 0, note: ''})
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
