import React, { Component, PropTypes } from 'react'

export default class CellBuilder extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.currentRow = 1
    this.state.currentColumn = 1

    this.nextCell = this.nextCell.bind(this)
  }

  renderBuilder() {
    const { mtx } = this.props
    if (mtx.length < 2 || mtx[0].length < 2) return "Error, must have at least one option and one consideration!"
    const i = this.state.currentRow
    const j = this.state.currentColumn
    const value = mtx[i][j]
    const option = mtx[i][0]
    const consideration = mtx[0][j]
    const finished = (i==mtx.length-1 && j==mtx[0].length-1)
    return <div>
      <p><b>Option {i}, Consideration {j}</b></p>
      <text>Based on <b>{consideration}</b> alone, the option <b>{option}</b> should get a score of
      <input value={value} onChange={this.props.onChangeHandler(i,j)} style={{width: '20px', margin: '0 5px 0 5px'}}/>
      (-5 to 5)
      </text><br/>
      {finished ? <text>Done! <button onClick={this.props.setTab('matrix')}>View Plot</button></text> : <button onClick={this.nextCell}>Next Consideration</button>}
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

}
