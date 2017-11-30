import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'
import colors from '../colors'


const inputId = 'new_option'

export default class RowBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.openNotes = []

    this.onAddRow = this.onAddRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
  }

  render() {
    const rowNum = this.props.mtx.length - 1
    const {mtx} = this.props
    return (<div>
      <StepTitle title='Add Options' />
      <div style={{margin: '0 5%'}}>
        <p>List the most important options that you've considered:</p>
        <label>Current Options:</label><br/>
        <ul>
          {mtx.map((row, i) => {
            if (i==0) return ''
            const note= row[0].note
            return <li key={i} style={{background: colors.blue, width: '200px', padding: '15px', paddingRight: '25px', borderRadius: '5px'}}>
              <text style={{color: 'white'}}>{row[0].val}</text>
              <button onClick={this.deleteRow(i)} style={{margin: '0 10px'}}>X</button><br/>
              <button onClick={this.toggleNote(i)}>
                {this.state.openNotes[i] ? <text>&#9663; </text> : <text>&#9657; </text>}
                note
              </button>
              {this.state.openNotes[i]
                ? <div style={{paddingTop: '10px', paddingBottom: '5px'}}><textarea value={note} onChange={this.props.onChangeNote(i,0)} placeholder='(describe the option in more detail)' style={{width: '100%'}}/></div>
                : ''
              }
            </li>
          })}
        </ul>
        <input id={inputId} placeholder='Option Name' onKeyPress={this.checkEnter} onClick={(e)=>e.target.select()}/>
        <button onClick={this.onAddRow}>Add</button><br/>
        <p>Option names should be 1 or 2 words. Put any additional details in a note.</p>
      </div>
    </div>)
  }

  onAddRow() {
    const { mtx } = this.props
    const newRow = []
    mtx[0].forEach((col, i) => {
      const input = document.getElementById(inputId)
      const val = (i==0) ? input.value : 0
      input.value = ''
      input.focus()
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

  toggleNote(i) {
    return () => {
      let openNotes = this.state.openNotes
      openNotes[i] = !openNotes[i]
      this.setState({openNotes})
    }
  }

  checkEnter (e) {
    if (e.which == 13 || e.keyCode == 13) this.onAddRow()
  }
}
