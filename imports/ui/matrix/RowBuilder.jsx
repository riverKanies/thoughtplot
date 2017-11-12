import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'


const inputId = 'new_option'

export default class RowBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.onAddRow = this.onAddRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
  }

  render() {
    const rowNum = this.props.mtx.length - 1
    const {mtx} = this.props
    return (<div>
      <StepTitle title='Add Options' />
      <div style={{margin: '0 5%'}}>
        <p>What are the (3) options you're considering?</p>
        <label>Current Options:</label><br/>
        <ol>
          {mtx.map((row, i) => {
            if (i==0) return ''
            return <li key={i}>{row[0].val}<button onClick={this.deleteRow(i)} style={{marginLeft: '10px'}}>X</button></li>
          })}
        </ol>
        <input id={inputId} placeholder='ThotPlot' onClick={(e)=>e.target.select()}/>
        <button onClick={this.onAddRow}>Add</button><br/>
      </div>
    </div>)
  }

  onAddRow() {
    const { mtx } = this.props
    const newRow = []
    mtx[0].forEach((col, i) => {
      //const val = (i==0) ? "ThotPlot" : 0
      const val = (i==0) ? document.getElementById(inputId).value : 0
      newRow.push({val: val, note: ''})
    })
    mtx.push(newRow)
    this.props.changeMatrix(mtx)
  }

  deleteRow(i) {
    return () => {
      const {mtx} = this.props
      if(mtx.length < 2) return
      mtx.splice(i,1)
      this.props.changeMatrix(mtx)
    }
  }
}
