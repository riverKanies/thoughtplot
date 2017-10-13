import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import { Decisions } from '../api/decisions.js'

import MatrixBuilder from './matrix/MatrixBuilder.jsx'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.state.selectedTab = localStorage.getItem('mtxplayTab') || 'intro'

    const dec = props.decision
    if (dec) {
      this.state.decision = dec.decision
      this.state.mtx = dec.matrix
      this.state.isWeightedMtx = dec.isWeightedMatrix
      this.state.weights = dec.weights
    }else{
      this.state.decision = ""
      this.state.mtx = [
        [null]
      ]
      this.state.isWeightedMtx = false
      this.state.weights = []
    }

    this.setTab = this.setTab.bind(this)

    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onChangeDecision = this.onChangeDecision.bind(this)
    this.changeMatrix = this.changeMatrix.bind(this)
    this.addWeights = this.addWeights.bind(this)
    this.removeWeights = this.removeWeights.bind(this)
    this.onChangeWeightHandler = this.onChangeWeightHandler.bind(this)
    this.saveMatrix = this.saveMatrix.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.decision == this.props.decision) return
    const dec = nextProps.decision
    if (!dec) return
    this.setState({decision: dec.decision, mtx: dec.matrix, isWeightedMtx: dec.isWeightedMatrix, weights: dec.weights})
  }

  renderDecisions() {
    return this.props.decisions.map((dec) => (
      <p key={dec._id}>- {dec.decision}<button onClick={this.goTo(`/decisions/${dec._id}`)}>View</button></p>
    ))
  }

  renderLabelRow() {
    const labelRow = this.state.mtx[0].concat([`Score${this.state.isWeightedMtx ? ' (weighted)' : ''}`])
    //if (this.state.isWeightedMtx) labelRow.push('Weighted')
    return <tr>{this.renderRowOfLabels(labelRow,0)}</tr>
  }

  renderOptionRows() {
    this.scores = []
    const bestI = this.bestOption(this.state.mtx).index
    return this.state.mtx.slice(1).map((row, i) => {
      const score = this.scoreRow(row)
      let rowScored = row.concat(score)
      this.scores.push(score)
      const styles = (bestI == i) ? {background: "yellow"} : {}
      return <tr key={i} style={styles}>{this.renderRow(rowScored,i+1)}</tr>
    })
  }

  renderRow(row,i) {
    return row.map((cell, j) => {
      console.log('j',j)
      const styles = (j==0) ? {background: "orange"} : {background: "lightgray"}
      return <td key={j}>{this.renderCell(cell,i,j,styles)}</td>
    })
  }

  renderRowOfLabels(row,i) {
    return row.map((cell, j) => {
      const styles = {background: "lightblue"}
      return <td key={j}>{this.renderCell(cell,i,j,styles)}</td>
    })
  }

  renderCell(val,i,j,styles) {
    if (val === null) return
    if (j >= this.numColumns()) return val
    return <span>
      <input value={val} onChange={this.onChangeHandler(i,j)} style={styles}/>
      {this.state.isWeightedMtx && i==0 ? 'wght' : ''}
      {this.state.isWeightedMtx && j>0 && i>0 ? (val * this.state.weights[j]) : ''}
    </span>
  }

  renderWeightsRow() {
    if (!this.state.isWeightedMtx) return <tr><td><button onClick={this.addWeights}>Add Weights</button></td></tr>
    return <tr>{this.state.mtx[0].map((label, i) => {
      if (label == null) return <td key='0'>Weights<button onClick={this.removeWeights}>X</button></td>
      return <td key={i}><input value={this.state.weights[i]} onChange={this.onChangeWeightHandler(i)} style={{background: "purple", border: "2px solid black", borderRadius: "5px"}}/></td>
    })}</tr>
  }

  renderSaveMatrix() {
    if (!this.props.currentUser) return <button disabled="true">Save Matrix (must be logged in)</button>
    return <button onClick={this.saveMatrix}>Save Matrix</button>
  }

  renderTab() {
    const bestOption = this.bestOption(this.state.mtx)
    if (this.state.selectedTab === 'intro') return (<section>
      <header>
        <h1>Introduction to the Decision Communication Tool (DCT)</h1>
      </header>
      <p>
      Welcome to the DCT. This tool will walk you through making a decision matrix.
       A decision matrix is a useful tool for documenting and communicating reasoning used to make a decision.
        Basically, you will create a table of options vs. variables, then score each option by summing the values for each variable.
         When you're done, one option should have the highest score, indicating that you think it is the best.
          The DCT can be helpful for making decisions, but its main purpose is for communicating decisions to your peers and/or partners, whoever will be affected by the decision.
           Documenting critical design and process related decisions using the DCT will help to get everyone on the same page and working efficiently together.
      </p>
      <p>
      Using the DCT in no way guarantees that everyone will agree on which option is best.
       However, decision matricies can be compared to reveal where critical discrepencies in reasoning are, which can help to facilitate a discussion about the decision.
      </p>
    </section>)
    if (this.state.selectedTab === 'builder') return (<section>
      {this.props.routeDecisionId && !this.props.decision ?
        <h1 style={{color: "red"}}>No such decision</h1> :
        <div>
          <MatrixBuilder
            decision={this.state.decision}
            mtx={this.state.mtx}
            onChangeHandler={this.onChangeHandler}
            changeMatrix={this.changeMatrix}
            onChangeDecision={this.onChangeDecision} />
        </div>}
    </section>)
    if (this.state.selectedTab === 'matrix') return (<section>
      {this.props.routeDecisionId && !this.props.decision ?
        <h1 style={{color: "red"}}>No such decision</h1> :
        <div>
          <header>
            <h1>Decision</h1>
          </header>
          <p>This is the decision you are documenting. Feel free to edit it here:</p>
          <textarea value={this.state.decision} onChange={this.onChangeDecision}/>
          <header>
            <h1>Matrix</h1>
          </header>
          <p>This is the final decision matrix. It will automatically calculate overall scores whenever any values are changed. Feel free to edit any values here.</p>
          <p>Remember, columns for negative values (such as cost) should be given a negative weight.</p>
          <table>
            <tbody>
              {this.renderLabelRow()}
              {this.renderOptionRows()}
              {this.renderWeightsRow()}
            </tbody>
          </table>
          <b>Best: {bestOption.option}, Score: {bestOption.score}</b>
          {this.renderSaveMatrix()}
          <br/><br/>
          <h3>Notes:</h3>
          <p><b>Scoring</b>: If there are any blank cells in your decision matrix fill them in now.
           Values you fill in should represent the relative importance of that variable for that option.
           It doesn't matter what scale you choose to use (0-1, 1-10, 1-100).
           The values you fill in are simply summed for each option to determine the final overall score for that option.
           However, if you choose to add weights (by clicking 'Add Weights' at the bottom of the matrix)
           each column will be multiplied by its weight value when summed for the final score (weighted values are shown to the right of the input value for each cell).
          </p>
          <p><b>Self Review</b>: Look over your matrix, paying special attention to the overall scores.
           Do the scores align with your intuition about which choice is best?
            If not, modify some of your scores to capture your intuition as best you can.
             Is there something relevant to the decision that you haven't yet made a column for?
              If so, add a column now (you'll have to go back to the
               Column Builder step).
          </p>
        </div>}
    </section>)
    if (this.state.selectedTab === 'list') return (<section>
      <header>
        <h1>Decision List</h1>
      </header>
      <ul>
        {this.renderDecisions()}
      </ul>
    </section>)
  }

  render() {
    return (
      <div className="container">
        <AccountsUIWrapper />
        <section>
          <button onClick={this.setTab('intro')} style={this.state.selectedTab === 'intro' ? {borderColor: 'blue'} : {}}>Intro</button>
          <button onClick={this.setTab('builder')} style={this.state.selectedTab === 'builder' ? {borderColor: 'blue'} : {}}>Builder</button>
          <button onClick={this.setTab('matrix')} style={this.state.selectedTab === 'matrix' ? {borderColor: 'blue'} : {}}>Matrix</button>
          <button onClick={this.setTab('list')} style={this.state.selectedTab === 'list' ? {borderColor: 'blue'} : {}}>List</button>
        </section>
        {this.renderTab()}
      </div>
    )
  }

  setTab(l) {
    return ()=>{
      window.localStorage.setItem('mtxplayTab', l)
      this.setState({selectedTab: l})
    }
  }

  addWeights() {
    const weights = this.state.mtx[0].map(() => (1))
    this.setState({isWeightedMtx: true, weights: weights})
  }

  removeWeights() {
    this.setState({isWeightedMtx: false})
  }

  changeMatrix(mtx) {
    const {weights} = this.state
    if (this.state.weights.length < mtx[0].length) weights.push(1)
    this.setState({mtx: mtx, weights: weights})
  }

  onChangeHandler(i,j) {
    return (e) => {
      const { mtx } = this.state
      mtx[i][j] = e.target.value
      this.setState(mtx: mtx)
    }
  }

  onChangeDecision(e) {
    this.setState({decision: e.target.value})
  }

  onChangeWeightHandler(i) {
    return (e) => {
      const { weights } = this.state
      weights[i] = e.target.value
      this.setState({weights: weights})
    }
  }

  numColumns() {
    return this.state.mtx[0].length
  }

  scoreRow(row) {
    return !this.state.isWeightedMtx ?
      row.slice(1).reduce((a,b) => (parseInt(a)+parseInt(b)), 0) :
      row.slice(1).reduce((a,b,j) => (parseInt(a)+parseInt(b)*this.state.weights[j+1]), 0)
  }

  bestOption(mtx) {
    if (mtx.length < 2) return {}
    const scored = mtx.slice(1).map((row, i) => {
      const score = this.scoreRow(row)
      return {option: row[0], index: i, score: score}
    })
    return scored.reduce((a,b) => {
      if (a.score > b.score) return a
      return b
    })
  }

  saveMatrix() {
    const decision = {
      decision: this.state.decision,
      matrix: this.state.mtx,
      isWeightedMatrix: this.state.isWeightedMtx,
      weights: this.state.weights
    }
    Meteor.call('decisions.insert', decision)
  }

  goTo(path) {
    return () => FlowRouter.go(path)
  }
}

App.propTypes = {
  decisions: PropTypes.array.isRequired,
}

export default createContainer(() => {
  return {
    routeDecisionId: FlowRouter.getParam('_id'),
    decision: Decisions.findOne({_id: FlowRouter.getParam('_id')}),
    currentUser: Meteor.user(),
    decisions: Decisions.find({}).fetch(),
  }
}, App)
