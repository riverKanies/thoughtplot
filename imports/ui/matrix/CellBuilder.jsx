import React, { Component, PropTypes } from 'react'
import StepTitle from './StepTitle'
import colors from '../colors'
import utils from './utils'

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
    this.state.currentColumn = 1
    this.state.isCostArray = []

    this.nextColumn = this.nextColumn.bind(this)
    this.selectBtn = this.selectBtn.bind(this)
    this.toggleIsCost = this.toggleIsCost.bind(this)
  }

  renderScoreButtons(row, value) {
    const isCost = this.isCost()
    //labeled as cost
    if (isCost) return <div className='row'>
      <div className='col-3'></div>
      {range.map((s,i) => {
        let label = null
        if (i==range.length-1) label = 'high cost'
        if (s == 0) label = 'neutral'
        const selectedStyles = (-s == value) ? {background: colors.orange, color: 'white'} : {}
        return <div key={s} className='col-1' style={{textAlign: 'center'}}>
          <button style={{...btnStyles, ...selectedStyles, borderColor: colors.orange}} onClick={this.selectBtn(row,-s)}>{s}</button>
          {label ? <div style={{color: colors.orange, fontSize:'.6em'}}>{label}</div> : ''}
        </div>
      })}
    </div>
    //unlabeled
    if (!isCost && isCost !== false) return <div className='row'>
      {fullRange.map((s,i) => {
        let label = null
        if (i==0) label = 'high cost'
        if (i==fullRange.length-1) label = 'high benefit'
        if (s == 0) label = 'neutral'
        const color = (s<0 ? colors.orange : colors.blue)
        const selectedStyles = (s == value) ? {background: color, color: 'white'} : {}
        return <div key={s} className='col-1' style={{textAlign: 'center'}}>
          <button style={{...btnStyles, ...selectedStyles}} onClick={this.selectBtn(row,s)}>{s}</button>
          {label ? <div style={{color: color, fontSize:'.6em'}}>{label}</div> : ''}
        </div>
      })}
    </div>
    //labeled as benefit
    return <div className='row'>
      <div className='col-3'></div>
      {range.map((s,i) => {
        let label = null
        if (i==range.length-1) label = 'high benefit'
        if (s == 0) label = 'neutral'
        const selectedStyles = (s == value) ? {background: colors.blue, color: 'white'} : {}
        return <div key={s} className='col-1' style={{textAlign: 'center'}}>
          <button style={{...btnStyles, ...selectedStyles}} onClick={this.selectBtn(row,s)}>{s}</button>
          {label ? <div style={{color: colors.blue, fontSize:'.6em'}}>{label}</div> : ''}
        </div>
      })}
    </div>
  }

  renderScoreDescription (i) {
    const isCost = this.isCost()
    const { mtx } = this.props
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

  renderScoreSection(i) {
    const { mtx } = this.props
    const j = this.state.currentColumn
    const value = mtx[i][j].val
    return <div style={{textAlign: 'center'}}>
      {this.renderScoreDescription(i)}
      {this.renderScoreButtons(i,value)}
    </div>
  }

  renderCostBtn() {
    const { mtx } = this.props
    if (mtx.length < 2 || mtx[0].length < 2) return <text style={{color: 'red'}}>"Error, must have at least one option and one consideration!"</text>
    const j = this.state.currentColumn
    const cell = mtx[0][j]
    const consideration = cell.val

    const fontSize = '7px'
    const containerStyles = {float: 'right', fontSize, padding: '3px', border: `1px solid ${colors.blue}`, borderTop: '0px', marginRight: '7px'}
    const btnStyles = {fontSize}
    if (this.isCost()) return <div style={containerStyles}>
      <button style={{...btnStyles, background: colors.orange, color: 'white'}} onClick={this.toggleIsCost(j,false)}>Cost</button>
    </div>
    if (this.isCost() === false) return <div style={containerStyles}>
    <button style={{...btnStyles, background: colors.blue, color: 'white'}} onClick={this.toggleIsCost(j,true)}>Benefit</button>
  </div>
    return <div style={containerStyles}>
      <button style={this.isCost() ? {...btnStyles, background: colors.orange, color: 'white'} : btnStyles} onClick={this.toggleIsCost(j,true)}>Cost</button>
      <text style={{margin: '0 5px'}}>or</text>
      <button style={this.isCost() === false ? {...btnStyles, background: colors.blue, color: 'white'} : btnStyles} onClick={this.toggleIsCost(j,false)}>Benefit</button>
      <text style={{marginLeft: '5px'}}>?</text>
    </div>
  }

  renderBuilder() {
    const { mtx } = this.props
    if (mtx.length < 2 || mtx[0].length < 2) return <text style={{color: 'red'}}>"Error, must have at least one option and one consideration!"</text>
    const j = this.state.currentColumn
    const cell = mtx[0][j]
    const consideration = cell.val
    const finished = (j==mtx[0].length-1)

    return <div>
      <div>
        <div style={{width: '300px', margin: '0 auto'}}>
          <div style={{border: `2px solid ${colors.blue}`, textAlign: 'center', color: colors.blue, fontSize: '2em', overflow: 'hidden', padding: '5px 0'}}>{consideration}</div>
          {this.renderCostBtn()}
        </div><br/><br/>
      </div>
      <div style={{}}>
        {this.props.mtx.map((row, i)=>{
          if (i===0) return ''
          const option = row[0].val
          const note = row[j].note
          return <div key={i} style={{width: '100%', background: 'white', margin: '20px 0', padding: '10px 0', borderRadius: '10px', textAlign: 'center'}}>
            <div style={{width: '200px', margin: '0 auto 20px', textAlign: 'center', border: `2px solid ${colors.orange}`, marginTop: '20px', padding: '3px 0'}}><b style={{color: colors.orange}}>{option}</b></div>
            <textarea
              value={note}
              onChange={this.props.onChangeNote(i,j)}
              placeholder={`Briefly describe the costs and benefits of ${consideration} for ${option}`}
              style={{width: '270px', margin: '10px 0', height: '50px'}}/>
            <br/>
            {this.renderScoreSection(i)}
          </div>
        })}
      </div>
      <br/><br/>
      <div style={{width: '100%', textAlign: 'center'}}>
        {finished ? <text><button onClick={this.props.setTab('matrix')} style={nxtStyles}>View Plot &#8680;</button></text> :
          <button onClick={this.nextColumn} style={nxtStyles}>Next Consideration &#8680;</button>
        }
      </div>
    </div>
  }

  render() {
    return (<div id='cellBuilder'>
      <StepTitle title='Score Options' />
      <div style={{margin: '0 5%', paddingTop: '40px'}}>
        {this.renderBuilder()}
      </div>
    </div>)
  }

  nextColumn() {
    window.scroll(0, utils.findPos(document.getElementById('cellBuilder'))-70)
    const j = this.state.currentColumn
    this.setState({currentColumn: j+1, isCost: this.props.mtx[0][j+1].isCost || null})
  }

  selectBtn(i,s) {
    return () => {
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