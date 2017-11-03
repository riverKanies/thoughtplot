import React, { Component, PropTypes } from 'react'

const inputId = 'new_consideration'

export default class ColumnBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.addColumn = this.addColumn.bind(this)
    this.cancelColumn = this.cancelColumn.bind(this)
  }

  render() {
    const colNum = this.props.mtx[0].length-1
    const {mtx} = this.props
    const numCols = mtx[0].length
    return (<div>
      <p>
        <b>Add Considerations</b><br/>
        What are the (3) most important considerations for your decision? Think about where your options differ significantly.
      </p>
      <label>Current Considerations:</label>
      <ol>
        {mtx[0].map((labelObj, i) => {
          const label = labelObj.val
          if (i==0) return ''
          return <li key={i}>{label}{i==(numCols-1) ? <button onClick={this.cancelColumn} style={{marginLeft: '10px'}}>X</button>: ''}</li>
        })}
      </ol>
      <input id={inputId} placeholder='time' onClick={(e)=>e.target.select()} />
      <button onClick={this.addColumn}>Add</button><br/>
    </div>)
  }

  addColumn() {
    const { mtx } = this.props
    mtx.map((row, i) => {
      const val = document.getElementById(inputId).value
      if (i==0) return row.push({val: val, note: ''})
      return row.push({val: 0, note: ''})
    })
    this.props.changeMatrix(mtx)
  }

  cancelColumn() {
    const { mtx } = this.props
    if (mtx[0].length < 2) return
    mtx.map((row) => {
      return row.pop()
    })
    this.props.changeMatrix(mtx)
  }
}
