import { Meteor } from 'meteor/meteor';
import { Decisions } from '../imports/api/decisions.js'

Meteor.startup(() => {
  // code to run on server at startup
  const decisions = Decisions.find().fetch()
  //console.log('decisions', decisions)
  decisions.forEach((dec)=>{
    console.log('decz', dec)
    Decisions.remove(dec._id)
  })
});
