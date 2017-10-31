import { Meteor } from 'meteor/meteor';
import { Decisions } from '../imports/api/decisions.js'
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(() => {
  Accounts.config({
    sendVerificationEmail: true
  })
  Accounts.emailTemplates.siteName = "ThotPlot"
  Accounts.emailTemplates.from = "thotplot@thotplot.herokuapp.com"
  Accounts.emailTemplates.verifyEmail = {
    subject(user) {
      return 'Verify your email for ThotPlot'
    },
    text(user, url) {
      const verificationCode = url.split('#')[1]
      const correctUrl = 'http://thotplot.herokuapp.com/#'+verificationCode
      return `Thanks for using ThotPlot, click the following link to verify your email: ${correctUrl}`
    }
  }

  const adminEmail = 'river.kanies@gmail.com'
  const user = Accounts.findUserByEmail(adminEmail)
  if (user) {
    Decisions.remove({owner: user._id})
    Meteor.users.remove(user._id)
  }
});

Accounts.onCreateUser(function(options, user) {
  if (user.profile == undefined) {
    user.profile = {}
    user.profile.collaborators = []
  }
  return user
});


// delete all decisions
  // // code to run on server at startup
  // const decisions = Decisions.find().fetch()
  // //console.log('decisions', decisions)
  // decisions.forEach((dec)=>{
  //   console.log('decz', dec)
  //   Decisions.remove(dec._id)
  // })

// delete all users
  // const users = Meteor.users.find().fetch()
  // users.forEach(u=>{
  //   if (!u.profile) {
  //     Meteor.users.remove(u._id) //Meteor.users.findOne(u._id, {$set: {profile: {collaborators: []}}})
  //   }
  // })