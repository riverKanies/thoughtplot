import React, { Component, PropTypes } from 'react'
import colors from './colors'


const deleteMatrix = (id)=>{
    return () => {
      const confirmed = confirm('Are you sure you want to delete this decision?')
      if (confirmed) Meteor.call('decisions.remove', id)
    }
}

export class DecisionsList extends Component {
    render() {
        return <div>{this.props.decisions.map((dec) => {
            const isCurrentDec = (this.props.decision && this.props.decision._id == dec._id)
            return <p key={dec._id}  style={isCurrentDec ? {color: colors.blue} : {}}>
            &#9672; {dec.decision}&#8195;{isCurrentDec ? <button disabled style={{color: colors.blue}}>(viewing)</button> : <button onClick={()=>{this.props.setTab('matrix')(); this.props.goTo(`/decisions/${dec._id}`)()}}>View</button>}
            &#8195;<button onClick={deleteMatrix(dec._id)}>Delete</button>&#8195;
            {this.props.shareId == dec._id ? <button disabled style={{color: colors.blue}}>(open above)</button> : <button onClick={this.props.shareMatrix(dec._id)}>Communicate</button>}
            </p>
        })}</div>
    }
}

export class SharedDecisionsList extends Component {
    render () {
        return <div>{this.props.decisionsShared.map((dec) => {
            const isCurrentDec = (this.props.decision && this.props.decision._id == dec._id)
            return <p key={dec._id}  style={isCurrentDec ? {color: colors.blue} : {}}>
            &#9672; {dec.decision}&#8195;{isCurrentDec ? ' (viewing)': <button onClick={()=>{this.props.setTab('matrix')(); this.props.goTo(`/decisions/${dec._id}`)()}}>View</button>}
            </p>
        })}</div>
    }
}