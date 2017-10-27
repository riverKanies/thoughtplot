import React, { Component, PropTypes } from 'react'
import { Decisions } from '../api/decisions.js'

export default class Share extends Component {
    constructor (props) {
        super(props)

        this.state = {}

        this.addCollaboratorToDecision = this.addCollaboratorToDecision.bind(this)
        this.removeCollaboratorFromDecision =this.removeCollaboratorFromDecision.bind(this)
        this.findUser = this.findUser.bind(this)        
    }
    render() {
        const id = this.props.shareId
        if (!id) return null
        const dec = (Decisions.findOne(id))
        if (!dec) return null
        const userExists = this.state.userExists
        const userExistsStatus = userExists ? <text style={{color: 'lightgreen'}}>Found!</text> : (userExists === false ? <text style={{color: 'red'}}>No such user!</text> : '')
        return (<div style={{border: '2px solid lightgray', borderRadius: '5px', padding: '10px'}}>
          <p><b>Select Collaborators for: </b>{dec.decision}</p>
          <p>Decision Collaborators:</p>
          <ul>
            {dec.collaborators.map((email, i)=>{
              return <li key={i}>{email}<button onClick={this.removeCollaboratorFromDecision(email)}>X</button></li>
            })}
          </ul>
          <p>My Collaborators:</p>
          <ul>
            {Meteor.user().profile.collaborators.map((email, i)=>{
              return <li key={i}>
                {email}
                <button onClick={this.addCollaboratorToDecision(email)}>Add</button>
                <button onClick={this.removeCollaborator(email)}>X</button>
              </li>
            })}
          </ul>
          <label>Find Collaborators by Email:</label><br/>
          <input id='new_collaborator'/><br/>
          <button onClick={this.findUser}>Find</button>
          {userExistsStatus}<br/>
          <button onClick={this.addCollaborator}>Add to My Collaborators</button>
        </div>)
    }

    addCollaborator() {
        const email = document.getElementById('new_collaborator').value
        Meteor.call('users.addCollaborator', email)
    }
    
    removeCollaborator(email) {
        return () => {
            Meteor.call('users.removeCollaborator', email)
        }
    }
    
    addCollaboratorToDecision(email) {
        return () => {
            Meteor.call('decisions.addCollaborator', email, this.props.shareId)
        }
    }
    
    removeCollaboratorFromDecision(email) {
        return () => {
            Meteor.call('decisions.removeCollaborator', email, this.props.shareId)
        }
    }

    findUser() {
        const email = document.getElementById('new_collaborator').value
        Meteor.call('users.find', email, (error, userExists)=>{
            this.setState({userExists})
        })
    }
}