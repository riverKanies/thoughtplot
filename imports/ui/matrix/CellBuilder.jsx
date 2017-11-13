import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'
import colors from '../colors'

const range = [0,1,2,3,4,5]
const fullRange = [-5,-4,-3,-2,-1,0,1,2,3,4,5]
const btnStyles = {
  width: '25px',
  textAlign: 'center',
  border: `1px solid lightgray`,
  borderRadius: '50%',
  background: 'white'
}
const nxtStyles = {
  border: `1px solid ${colors.blue}`,
  background: 'white',
  borderRadius: '3px',
  color: colors.blue,
  fontSize: '1.5em',
  marginBottom: '20px'
}
const asideStyles = {
  color: 'lightgray',
  fontSize: '0.8em'
}

export default class CellBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.currentRow = 1
    this.state.currentColumn = 1
    this.state.isCostArray = []

    this.nextCell = this.nextCell.bind(this)
    this.selectBtn = this.selectBtn.bind(this)
    this.toggleIsCost = this.toggleIsCost.bind(this)
  }

  renderScoreButtons(value) {
    const isCost = this.isCost()
    if (isCost) return <div className='row'>
      {range.map((s,i) => {
        let label = null
        if (i==range.length-1) label = 'high cost'
        if (s == 0) label = 'neutral'
        const selectedStyles = (-s == value) ? {background: colors.orange, color: 'white'} : {}
        return <div key={s} className='col-1' style={{textAlign: 'center'}}>
          <button style={{...btnStyles, ...selectedStyles, borderColor: colors.orange}} onClick={this.selectBtn(-s)}>{s}</button>
          {label ? <div style={{color: colors.orange, fontSize:'.6em'}}>{label}</div> : ''}
        </div>
      })}
    </div>
    if (!isCost && isCost !== false) return <div className='row'>
      {fullRange.map((s,i) => {
        let label = null
        if (i==0) label = 'high cost'
        if (i==fullRange.length-1) label = 'high benefit'
        if (s == 0) label = 'neutral'
        const color = (s<0 ? colors.orange : colors.blue)
        const selectedStyles = (s == value) ? {background: color, color: 'white'} : {}
        return <div key={s} className='col-1' style={{textAlign: 'center'}}>
          <button style={{...btnStyles, ...selectedStyles}} onClick={this.selectBtn(s)}>{s}</button>
          {label ? <div style={{color: color, fontSize:'.6em'}}>{label}</div> : ''}
        </div>
      })}
    </div>
    return <div className='row'>
      {range.map((s,i) => {
        let label = null
        if (i==range.length-1) label = 'high benefit'
        if (s == 0) label = 'neutral'
        const selectedStyles = (s == value) ? {background: colors.blue, color: 'white'} : {}
        return <div key={s} className='col-1' style={{textAlign: 'center'}}>
          <button style={{...btnStyles, ...selectedStyles}} onClick={this.selectBtn(s)}>{s}</button>
          {label ? <div style={{color: colors.blue, fontSize:'.6em'}}>{label}</div> : ''}
        </div>
      })}
    </div>
  }

  renderScoreDescription () {
    const isCost = this.isCost()
    const { mtx } = this.props
    const i = this.state.currentRow
    const j = this.state.currentColumn
    const value = mtx[i][j].val
    const option = mtx[i][0].val
    const cell = mtx[0][j]
    const consideration = cell.val
    if (isCost) return <text>Based on <b style={{color: colors.blue}}>{consideration}</b> alone, how costly is <b style={{color: colors.orange}}>{option}</b>?
    <br/><br/></text>
    if (!isCost && isCost !== false) return <text>Based on <b style={{color: colors.blue}}>{consideration}</b> alone, the option <b style={{color: colors.orange}}>{option}</b> should get a score of:
    <br/><br/></text>
    return <text>Based on <b style={{color: colors.blue}}>{consideration}</b> alone, how beneficial is <b style={{color: colors.orange}}>{option}</b>?
    <br/><br/></text>

  }

  renderScoreSection() {
    const isCost = this.isCost()
    const { mtx } = this.props
    const i = this.state.currentRow
    const j = this.state.currentColumn
    const value = mtx[i][j].val
    const option = mtx[i][0].val
    const cell = mtx[0][j]
    const consideration = cell.val
    return <text>
      {this.renderScoreDescription()}
      {this.renderScoreButtons(value)}
    </text>
  }

  renderBuilder() {
    const { mtx } = this.props
    if (mtx.length < 2 || mtx[0].length < 2) return <text style={{color: 'red'}}>"Error, must have at least one option and one consideration!"</text>
    const i = this.state.currentRow
    const j = this.state.currentColumn
    const value = mtx[i][j].val
    const option = mtx[i][0].val
    const cell = mtx[0][j]
    const consideration = cell.val
    const finished = (i==mtx.length-1 && j==mtx[0].length-1)
    const note = this.props.mtx[i][j].note
    return <div>
      <p>
        <b style={{color: colors.orange}}>{option}</b>
        <b> - </b>
        <b style={{color: colors.blue}}>{consideration}</b>
      </p>
      <p>Is <b style={{color: colors.blue}}>{consideration}</b> a cost or a benefit?&#8195;
        <button style={this.isCost() ? {background: colors.orange, color: 'white'} : {}} onClick={this.toggleIsCost(j,true)}>Cost</button>&#8195;
        <button style={this.isCost() === false ? {background: colors.blue, color: 'white'} : {}} onClick={this.toggleIsCost(j,false)}>Benefit</button>
      </p>
      {this.renderScoreSection()}
      <br/><br/>
      <label>Add a Note:</label><br/>
      <textarea value={note} onChange={this.props.onChangeNote(i,j)} placeholder='(describe why you think this score is appropriate)'/><br/>
      <br/><br/>
      {finished ? <text><button onClick={this.props.setTab('matrix')} style={nxtStyles}>View Plot &#8680;</button></text> : <button onClick={this.nextCell} style={nxtStyles}>Next Consideration &#8680;</button>}
    </div>
  }

  render() {
    return (<div id='cellBuilder'>
      <StepTitle title='Score Options' />
      <div style={{margin: '0 5%'}}>
        <p>Give each option a score for each consideration.</p>
        {this.renderBuilder()}
      </div>
    </div>)
  }

  nextCell() {
    window.scroll(0,findPos(document.getElementById('cellBuilder'))-70)
    const i = this.state.currentRow
    const j = this.state.currentColumn
    if (j==this.props.mtx[0].length-1) {
      this.setState({currentRow: i+1, currentColumn: 1, isCost: this.props.mtx[0][1].isCost || null})
    } else {
      this.setState({currentColumn: j+1, isCost: this.props.mtx[0][j+1].isCost || null})
    }
  }

  selectBtn(s) {
    return () => {
      const i = this.state.currentRow
      const j = this.state.currentColumn
      this.props.onChangeHandler(i,j,s)
    }
  }

  toggleIsCost(j, isCost) {
    return () => {
      const { isCostArray } = this.state
      isCostArray[j] = isCost
      this.setState({isCostArray: isCostArray})
    }
  }
  
  isCost() {
    return this.state.isCostArray[this.state.currentColumn]
  }

}

function findPos(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
      do {
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
  return [curtop];
  }
}