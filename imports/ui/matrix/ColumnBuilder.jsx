import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'


const inputId = 'new_consideration'

export default class ColumnBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.addColumn = this.addColumn.bind(this)
    this.deleteColumn = this.deleteColumn.bind(this)
    this.toggleWeights = this.toggleWeights.bind(this)
  }

  render() {
    const colNum = this.props.mtx[0].length-1
    const {mtx} = this.props
    return (<div>
      <StepTitle title='Add Considerations' />
      <div style={{margin: '0 5%'}}>
        <p>
          What are the (3) most important considerations for your decision? Think about where your options differ significantly.
        </p>
        <label>Current Considerations:</label>
        <ol>
          {mtx[0].map((labelObj, i) => {
            const label = labelObj.val
            if (i==0) return ''
            return <li key={i}>{label}<button onClick={this.deleteColumn(i)} style={{marginLeft: '10px'}}>X</button></li>
          })}
        </ol>
        <input id={inputId} placeholder='time' onClick={(e)=>e.target.select()} />
        <button onClick={this.addColumn}>Add</button><br/>

        <p>All considerations are equally important: <input type='checkbox' checked={!this.props.isWeightedMtx} onChange={this.toggleWeights}/></p>
      </div>
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

  deleteColumn(i) {
    return () => {
      const { mtx } = this.props
      if (mtx[0].length < 2) return
      mtx.map((row) => {
        return row.splice(i,1)
      })
      this.props.changeMatrix(mtx)
    }
  }

  toggleWeights(e) {
    const checked = e.target.checked
    if (checked) {
      this.props.removeWeights()
    } else {
      this.props.addWeights()
    }
  }
}
