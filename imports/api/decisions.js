import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base'

export const Decisions = new Mongo.Collection('decisions')

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('decisions', function decisionsPublication() {
    return Decisions.find({owner: this.userId});
  });
  Meteor.publish('decisionsShared', function decisionsSharedPublication() {
    const currentUser = Meteor.users.findOne(this.userId)
    if (!currentUser) return []
    const email = currentUser.emails[0].address 
    return Decisions.find({collaborators: email})
  })
}

Meteor.methods({
  'decisions.insert'(dec) {
    const { decision, matrix, weights, isWeightedMatrix } = dec

    check(decision, String);
    check(matrix, Array);
    check(weights, Array)
    check(isWeightedMatrix, Boolean)

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const decSame = Decisions.findOne({owner: this.userId, decision: decision})
    if (decSame) {
      throw new Meteor.Error('you already have a decision with that name')
    }
    Decisions.insert({
      decision,
      matrix,
      weights,
      isWeightedMatrix,
      createdAt: new Date(),
      owner: this.userId,
      collaborators: [],
    });
  },
  'decisions.update'(dec) {
    const { matrix, weights, isWeightedMatrix } = dec
    Decisions.update({_id: dec.id, owner: this.userId}, { $set: {
      matrix,
      weights,
      isWeightedMatrix,
      updatedAt: new Date(),
    }})
  },
  'decisions.remove'(id) {
    Decisions.remove({_id: id, owner: this.userId})
  },
  'decisions.addCollaborator'(email, decId) {
    Decisions.update({_id: decId, owner: this.userId}, { $push: {collaborators: email} })
  },
  'decisions.removeCollaborator'(email, decId) {
    const collaborators = Decisions.findOne(decId).collaborators.filter((c)=>{
      return c != email
    })
    Decisions.update({_id: decId, owner: this.userId}, { $set: {collaborators} })
  },
  'users.find'(email) {
    if (Meteor.isServer) {
      const user = Accounts.findUserByEmail(email)
      return !!user
    }
  },
  'users.addCollaborator'(email) {
    Meteor.users.update(this.userId, {$push: {'profile.collaborators': email}})
    return Meteor.users.findOne(this.userId).profile
  },
  'users.removeCollaborator'(email) {
    const collaborators = Meteor.user().profile.collaborators.filter((c)=>{
      return c != email
    })
    Meteor.users.update(this.userId, {$set: {'profile.collaborators': collaborators}})
  }
});
