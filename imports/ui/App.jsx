import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Decisions } from '../api/decisions.js'
import MatrixBuilder from './matrix/MatrixBuilder.jsx'
import colors from './colors'
import IntroTab from './IntroTab'
import Share from './Share'
import {DecisionsList, SharedDecisionsList} from './Decisions'
import Logo3 from './svg/Logo3'
import Note from './Note'
import { decisionStyles } from './matrix/Decision'

const cellColClass = 'col-2'

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
        [{val: null, note: null}]
      ]
      this.state.isWeightedMtx = false
      this.state.weights = []
    }

    this.setTab = this.setTab.bind(this)
    this.renderTryit = this.renderTryit.bind(this)

    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onChangeNote = this.onChangeNote.bind(this)
    this.onChangeDecision = this.onChangeDecision.bind(this)
    this.changeMatrix = this.changeMatrix.bind(this)
    this.addWeights = this.addWeights.bind(this)
    this.removeWeights = this.removeWeights.bind(this)
    this.onChangeWeightHandler = this.onChangeWeightHandler.bind(this)
    this.saveMatrix = this.saveMatrix.bind(this)
    this.updateMatrix = this.updateMatrix.bind(this)
    this.shareMatrix = this.shareMatrix.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.decision == this.props.decision) return
    const dec = nextProps.decision
    if (!dec) return
    this.setState({decision: dec.decision, mtx: dec.matrix, isWeightedMtx: dec.isWeightedMatrix, weights: dec.weights})
  }

  renderRowOfLabels(row,i) {
    return row.map((cell, j) => {
      const styles = {background: colors.blue, width: '70px'}
      return <div key={j}>{this.renderCell(cell,i,j,styles)}</div>
    })
  }

  renderLabelRow() {
    const labelRow = this.state.mtx[0].concat([{val: `Score`}])
    return <div className='row hidden-when-small'>{this.renderRowOfLabels(labelRow,0)}</div>
  }

  renderOptionRows() {
    this.scores = []
    const bestI = this.bestOption(this.state.mtx).index
    return this.state.mtx.slice(1).map((row, i) => {
      const score = this.scoreRow(row)
      let rowScored = row.concat({val: score})
      this.scores.push({val: score})
      const styles = (bestI == i) ? {background: colors.yellow} : {}
      return <div  className='row' key={i} style={styles}>{this.renderRow(rowScored,i+1)}</div>
    })
  }

  renderRow(row,i) {
    return row.map((cell, j) => {
      const styles = (j==0) ? {background: colors.orange, width: '70px'} : {background: "lightgray", width: '20px'}
      return <div key={j}>{this.renderCell(cell,i,j,styles)}</div>
    })
  }

  renderCell(valObj,i,j,styles) {
    const val = valObj.val
    if (val === null) return <div className={cellColClass} />
    if (j >= this.numColumns()) return <div className={cellColClass} style={{textAlign: 'center', width: '70px', border: '1px solid black'}}><b>{val}</b></div>
    const note = this.state.mtx[i][j].note
    return <div className={cellColClass}>
      <div className='tooltipcontainer'>
        <input value={val} onChange={this.onChangeHandler(i,j)} style={styles}/>
        <span className='tooltip'>
          <textarea value={note} onChange={this.onChangeNote(i,j)} style={{color: 'white', background: 'black', border: '0px'}} placeholder="(add a note here)"/>
        </span>
      </div>
      {this.state.isWeightedMtx && j>0 && i>0 ? <text style={{fontSize: '.8em', margin: '8px 0px'}}>*{this.state.weights[j]}=<text>{val * this.state.weights[j]}</text></text> : ''}
      <text className='hidden-when-big' style={{color: colors.blue, marginLeft: '10px'}}>{this.state.mtx[0][j].val}</text>
    </div>
  }

  renderWeightsRow() {
    if (!this.state.isWeightedMtx) return <div className='row'><div className={cellColClass}><button onClick={this.addWeights}>Add Weights</button></div></div>
    return <div className='row'>{this.state.mtx[0].map((labelObj, i) => {
      const label = labelObj.val
      if (label == null) return <div className={cellColClass} key='0'>Weights <button onClick={this.removeWeights}>X</button></div>
      return (<div className={cellColClass} key={i}>
        <input value={this.state.weights[i]} onChange={this.onChangeWeightHandler(i)} style={{background: colors.purple, color: 'white', width: '20px'}}/>
        <text className='hidden-when-big' style={{color: colors.blue, marginLeft: '10px'}}>{this.state.mtx[0][i].val}</text>
      </div>)
    })}</div>
  }

  renderSaveMatrix() {
    const color = (this.props.currentUser && !this.matrixIsUpToDate()) ? colors.blue : 'lightgray'
    const baseBtnStyles = {padding: '10px', border: `2px solid ${color}`, fontSize: '1.2em', color}
    if (!this.props.currentUser) return <button disabled="true" style={baseBtnStyles}>Save Plot (must be logged in)</button>
    const isCurrentPlot = !!Decisions.findOne({owner: this.props.currentUser._id, decision: this.state.decision})
    if (!isCurrentPlot) return <button onClick={this.saveMatrix} style={baseBtnStyles}>Save New Plot</button>
    const userOwnedDec = Decisions.findOne({_id: this.props.routeDecisionId, owner: this.props.currentUser._id})
    if (userOwnedDec) return <button onClick={this.updateMatrix} style={baseBtnStyles}>Update Plot</button>
    return <button onClick={this.setTab('list')} style={baseBtnStyles}>view your copy &#8680;</button>
  }

  renderPlot() {
    const bestOption = this.bestOption(this.state.mtx)  
    const { mtx } = this.state
    if (mtx.length < 2 || mtx[0].length < 2) return <text style={{color: 'red'}}>Error, must have at least one option and one consideration!</text>
    return (<div>
      <div className='container' style={{border: '3px solid lightgray', borderRadius: '15px', padding: '10px 0', margin: '0', width: '100%', background: 'white'}}>
        {this.renderLabelRow()}
        {this.renderOptionRows()}
        {this.renderWeightsRow()}
      </div>
      <div style={{textAlign: 'center', width: '100%'}}>
        <div style={{margin: '20px'}}>
          <b>Best: <text style={{color: colors.orange}}>{bestOption.option}</text><br/>
          Score: <text style={{background: colors.yellow, border: '1px solid black', padding: '0 3px'}}>{bestOption.score}</text></b><br/>
        </div>
        {this.renderSaveMatrix()}
      </div>
    </div>)
  }

  renderNoDecision () {
    return <div>
      <h1>No such decision!</h1>
      <button onClick={this.goTo('/')}>Home</button>
    </div>
  }

  renderTryit() {
    const styles={border: `2px solid white`, borderRadius: '10px', color: 'white', background: colors.orange, fontSize: '2em'}
    return <section style={{textAlign: 'center', margin: '60px 20%', background: colors.blue, padding: '30px 0', borderRadius: '60px'}}>
      <button onClick={this.setTab('builder')} style={styles}>Try It &#8680;</button>
    </section>
  }

  renderTab() {
    return (<div>
      <IntroTab renderTryit={this.renderTryit} selectedTab={this.state.selectedTab}/>
      <section style={{display: (this.state.selectedTab === 'builder' ? '' : 'none')}}>
        {this.props.routeDecisionId && !this.props.decision ?
          this.renderNoDecision() :
          <div>
            <MatrixBuilder
              {...this.state}
              onChangeHandler={this.onChangeHandler}
              onChangeNote={this.onChangeNote}
              changeMatrix={this.changeMatrix}
              onChangeDecision={this.onChangeDecision}
              onChangeWeightHandler={this.onChangeWeightHandler}
              setTab={this.setTab}
              addWeights={this.addWeights}
              removeWeights={this.removeWeights} />
          </div>}
      </section>
      <section style={{display: (this.state.selectedTab === 'matrix' ? '' : 'none')}}>
        {this.props.routeDecisionId && !this.props.decision ?
          this.renderNoDecision() :
          <div>
            <header>
              <h1 style={{color: colors.blue, textAlign: 'center'}}>Decision</h1>
            </header>
            <p style={{textAlign: 'center'}}>This is the decision you are documenting. Feel free to edit it here:</p>
            <div style={{textAlign: 'center'}}><textarea value={this.state.decision} onChange={this.onChangeDecision} style={decisionStyles}/></div>
            <br/><br/>
            <header>
              <h1 style={{color: colors.blue, textAlign: 'center'}}>Plot</h1>
            </header>
            <p style={{textAlign: 'center'}}>This is the final ThotPlot. It will automatically calculate overall scores whenever any values are changed. Feel free to edit any values here.</p>
            {this.renderPlot()}
            <br/><br/>
            <h3 style={{color: colors.blue, textAlign: 'center'}}>Notes:</h3>
            <Note label='Scoring' content="The values you fill in are simply summed for each option to determine the final overall score for that option. However, if you choose to add weights (by clicking 'Add Weights' at the bottom of the plot) each consideration column will be multiplied by its weight value when summed for the final score (weighted values are shown to the right of the non-weighted values)."/>
            <Note label='Self Review' content="Look over your ThotPlot, paying special attention to the overall scores. Do the scores align with your intuition about which choice is best? If not, modify some of your scores to capture your intuition as best you can. Is there something relevant to the decision that you haven't yet made a consideration column for?" />
          </div>}
      </section>
      <section style={{display: (this.state.selectedTab === 'list' ? '' : 'none')}}>
        <header>
          <h1>Decision List</h1>
        </header>
        <Share {...this.state} />
        <p>My Decisions:</p>
        <ul>
          <DecisionsList {...this.props} shareId={this.state.shareId} goTo={this.goTo} setTab={this.setTab} shareMatrix={this.shareMatrix}/>
        </ul>
        <p>Shared With Me:</p>
        <ul>
          <SharedDecisionsList {...this.props} goTo={this.goTo} setTab={this.setTab}/>
        </ul>
      </section>
    </div>)
  }

  render() {
    const styles = {width: '100%', border: '2px solid lightgray', borderRadius: '5px', backgroundColor: colors.blue, color: 'white', fontSize: '0.8em'}
    const stylesActive = { ...styles, borderColor: colors.blue, color: colors.blue, backgroundColor: 'white',}
    const logoStyles = {background: colors.orange, borderRadius: '5px', height: '28px', textAlign: 'center', paddingTop: '1px'}
    return (
      <div style={{margin: '0', width: '100%'}}>
        <div style={{background: colors.purple, margin: '0', width: '90%', padding: '10px 5%'}}>
          <section className="row">
            <div className="col-3" style={{background: colors.blue, borderRadius: '5px', textAlign: 'center', height: '28px'}}><AccountsUIWrapper /></div>
            <div className="col-1" style={logoStyles} onClick={()=>{this.setTab('intro')(); this.goTo('/')()}}>
              <Logo3 height="25" logoColor={colors.yellow}/>
            </div>
            <div className="col-2"><button onClick={this.setTab('intro')} style={this.state.selectedTab === 'intro' ? stylesActive : styles}>Intro</button></div>
            <div className="col-2"><button onClick={this.setTab('builder')} style={this.state.selectedTab === 'builder' ? stylesActive : styles}>Builder</button></div>
            <div className="col-2"><button onClick={this.setTab('matrix')} style={this.state.selectedTab === 'matrix' ? stylesActive : styles}>Plot</button></div>
            <div className="col-2"><button onClick={this.setTab('list')} style={this.state.selectedTab === 'list' ? stylesActive : styles}>List</button></div>
          </section>
        </div>
        <div className="container">
          {this.renderTab()}
        </div>
        <br/><br/><br/><br/><br/><br/>
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

  onChangeHandler(i,j,score) {
    const { mtx } = this.state
    if (score || score === 0) {
      mtx[i][j].val = score
      this.setState({mtx: mtx})
      return
    }
    return (e) => {
      mtx[i][j].val = e.target.value
      this.setState({mtx: mtx})
    }
  }

  onChangeNote(i,j) {
    return (e) => {
      const { mtx } = this.state
      mtx[i][j].note = e.target.value
      this.setState({mtx: mtx})
    }
  }

  onChangeDecision(e) {
    this.setState({decision: e.target.value})
  }

  onChangeWeightHandler(i, weight) {
    return (e) => {
      const { weights } = this.state
      weights[i] = weight || e.target.value
      this.setState({weights: weights})
    }
  }

  numColumns() {
    return this.state.mtx[0].length
  }

  scoreRow(row) {
    return !this.state.isWeightedMtx ?
      row.slice(1).reduce((a,b) => (parseInt(a)+parseInt(b.val)), 0) :
      row.slice(1).reduce((a,b,j) => (parseInt(a)+parseInt(b.val)*this.state.weights[j+1]), 0)
  }

  bestOption(mtx) {
    if (mtx.length < 2) return {}
    const scored = mtx.slice(1).map((row, i) => {
      const score = this.scoreRow(row)
      return {option: row[0].val, index: i, score: score}
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

  updateMatrix () {
    const decision = {
      id: this.props.routeDecisionId,
      matrix: this.state.mtx,
      isWeightedMatrix: this.state.isWeightedMtx,
      weights: this.state.weights
    }
    Meteor.call('decisions.update', decision)
  }

  shareMatrix(id) {
    return () => {
      this.setState({shareId: id})
    }
  }

  goTo(path) {
    return () => FlowRouter.go(path)
  }

  matrixIsUpToDate() {
    const {decision, mtx, isWeightedMtx, weights} = this.state
    const savedDec = Decisions.findOne({decision, owner: this.props.currentUser._id})
    if (!savedDec) return false
    const dec = {decision, matrix: mtx, isWeightedMatrix: isWeightedMtx, weights}
    // check matrix
    if (dec.matrix.length != savedDec.matrix.length || dec.matrix[0].length != savedDec.matrix[0].length) return false
    for (let i=0;i<dec.matrix.length; i++) {
      for (let j=0;j<dec.matrix.length; j++) {
        const cell = dec.matrix[i][j]
        const savedCell = savedDec.matrix[i][j]
        if (!cell || !savedCell) return false
        if (cell.val != savedCell.val || cell.note != savedCell.note) return false
      }
    }
    // check weights
    for (let i=0;i<dec.weights.length; i++) {
      if (dec.weights[i] != savedDec.weights[i]) return false
    }
    // isWeightedMatrix
    if (dec.isWeightedMatrix != savedDec.isWeightedMatrix) return false
    return true
  }
}

App.propTypes = {
  decisions: PropTypes.array.isRequired,
}

export default createContainer(() => {
  Meteor.subscribe('decisions')
  Meteor.subscribe('decisionsShared')
  const currentUser = Meteor.user()
  const email = currentUser ? currentUser.emails[0].address : ''
  return {
    routeDecisionId: FlowRouter.getParam('_id'),
    decision: Decisions.findOne({_id: FlowRouter.getParam('_id')}),
    currentUser: currentUser,
    decisions: Decisions.find({owner: (currentUser||{})._id}).fetch(),
    decisionsShared: Decisions.find({collaborators: email}).fetch(),
  }
}, App)
