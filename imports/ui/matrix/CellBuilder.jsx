import React, { Component, PropTypes } from 'react'
import colors from '../colors'

const range = [-5,-4,-3,-2,-1,0,1,2,3,4,5]
const btnStyles = {
  width: '25px',
  textAlign: 'center',
  border: `1px solid ${colors.blue}`,
  borderRadius: '50%',
  background: 'white',
  margin: '3px'
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

    this.nextCell = this.nextCell.bind(this)
    this.selectBtn = this.selectBtn.bind(this)
  }

  renderScoreButtons(value) {
    return <div className='row'>
      {range.map((s) => {
        const selectedStyles = (s == value) ? {background: colors.blue} : {}
        return <div key={s} className='col-1' style={{textAlign: 'center'}}><button style={{...btnStyles, ...selectedStyles}} onClick={this.selectBtn(s)}>{s}</button></div>
      })}
    </div>
  }

  renderBuilder() {
    const { mtx } = this.props
    if (mtx.length < 2 || mtx[0].length < 2) return <text style={{color: 'red'}}>"Error, must have at least one option and one consideration!"</text>
    const i = this.state.currentRow
    const j = this.state.currentColumn
    const value = mtx[i][j].val
    const option = mtx[i][0].val
    const consideration = mtx[0][j].val
    const finished = (i==mtx.length-1 && j==mtx[0].length-1)
    const note = this.props.mtx[i][j].note
    return <div>
      <p><b>Option {i}, Consideration {j}</b></p>
      <text>Based on <b>{consideration}</b> alone, the option <b>{option}</b> should get a score of
      <br/><br/>
      {this.renderScoreButtons(value)}<br/>
      <text style={asideStyles}>(note that a consideration like cost should get a negative score)</text>
      </text><br/><br/>
      <label>Add a Note:</label><br/>
      <textarea value={note} onChange={this.props.onChangeNote(i,j)} placeholder='this option will save time in the long run'/><br/>
      <text style={asideStyles}>(describe why you think this score is appropriate)</text><br/>
      <br/><br/>
      {finished ? <text><button onClick={this.props.setTab('matrix')} style={nxtStyles}>View Plot &#8680;</button></text> : <button onClick={this.nextCell} style={nxtStyles}>Next Consideration &#8680;</button>}
    </div>
  }

  render() {
    return (<div>
      <p>
        <b>Score Options</b><br/>
        Give each option a score for each consideration.
      </p>
      {this.renderBuilder()}
    </div>)
  }

  nextCell() {
    const i = this.state.currentRow
    const j = this.state.currentColumn
    if (j==this.props.mtx[0].length-1) {
      this.setState({currentRow: i+1, currentColumn: 1})
    } else {
      this.setState({currentColumn: j+1})
    }
  }

  selectBtn(s) {
    return () => {
      const i = this.state.currentRow
      const j = this.state.currentColumn
      this.props.onChangeHandler(i,j,s)
    }
  }

}
