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
  'users.find'(email) {
    if (Meteor.isServer) {
      const user = Accounts.findUserByEmail(email)
      return !!user
    }
  }
});
