import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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

    Decisions.insert({
      decision,
      matrix,
      weights,
      isWeightedMatrix,
      createdAt: new Date(),
      owner: this.userId,
    });
  },
});
