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
        const sectionStyles = {background: 'white', borderRadius: '10px', padding: '10px', margin: '10px'}

        return (<div style={{border: '2px solid lightgray', borderRadius: '5px', padding: '10px', marginTop: '40px'}}>
            <div id="myModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={this.closeModal}>&times;</span>
                    <label>Find by email:</label><br/>
                    <input id='new_collaborator'/>
                    <button onClick={this.addCollaborator}>Add to list of collaborators</button><br/>
                    Optional: <button onClick={this.findUser}>Find</button>
                    {userExistsStatus}<br/>
                </div>
            </div>

            <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '2em', borderBottom: '2px solid black', margin: '0 30px'}}>Send Explanations</div>
                <p>{dec.decision}</p>
            </div>
            <div style={sectionStyles}>
                <p style={{borderBottom: '1px solid black'}}>Current Team: (have been sent the explanation for this decision)</p>
                <ul>
                    {(dec.collaborators.length === 0)
                        ? <li style={{color: 'lightgray'}}>(none yet)</li>
                        : dec.collaborators.map((email, i)=>{
                            return <li key={i}>{email}<button onClick={this.removeCollaboratorFromDecision(email)}>X</button></li>
                            })
                    }
                </ul>
            </div>
            <div style={sectionStyles}>
                <p style={{borderBottom: '1px solid black'}}>Send Explanations to Collaborators:</p>
                <ul>
                    {(Meteor.user().profile.collaborators.length === 0)
                        ? <li style={{color: 'lightgray'}}>(none yet)</li>
                        : Meteor.user().profile.collaborators.map((email, i)=>{
                            return <li key={i}>
                                {email}
                                <button onClick={this.addCollaboratorToDecision(email)}>&#8599; Send Explanation</button>
                                <button onClick={this.removeCollaborator(email)}>X</button>
                            </li>
                        })
                    }
                </ul>
                <button onClick={this.openModal}>+ Add New Collaborator</button>
            </div>
        </div>)
    }

    addCollaborator() {
        const email = document.getElementById('new_collaborator').value
        Meteor.call('users.addCollaborator', email)
    }
    
    removeCollaborator(email) {
        return () => {
            if (!confirm('Delete collaborator from your list?')) return
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
            if (!confirm('Revoke permissions to view your decision for this user?')) return            
            Meteor.call('decisions.removeCollaborator', email, this.props.shareId)
        }
    }

    findUser() {
        const email = document.getElementById('new_collaborator').value
        Meteor.call('users.find', email, (error, userExists)=>{
            this.setState({userExists})
        })
    }

    openModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = "block";
    }

    closeModal() {
        const modal = document.getElementById('myModal');        
        modal.style.display = "none";
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('myModal');            
    if (event.target == modal) {
        modal.style.display = "none";
    }
}