import { Meteor } from 'meteor/meteor';
import { Decisions } from '../imports/api/decisions.js'
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(() => {
  Accounts.config({
    sendVerificationEmail: true
  })
  Accounts.emailTemplates.siteName = "ThoughtPlot"
  Accounts.emailTemplates.from = "river.kanies@gmail.com" //"thoughtplot@thoughtplot.io"
  Accounts.emailTemplates.replyTo
  Accounts.emailTemplates.verifyEmail = {
    subject(user) {
      return 'Verify your email for ThoughtPlot'
    },
    text(user, url) {
      const verificationCode = url.split('#')[1]
      const correctUrl = 'http://www.thoughtplot.io/#'+verificationCode
      return `Thanks for using ThoughtPlot! Click the following link to verify your email: ${correctUrl}.\n\nFeel free to reply with any questions.\n\n-river`
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
  const email = user.emails[0].address || null
  if (email) Email.send({from: 'thoughtplot@thoughtplot.io', to: 'river.kanies@gmail.com', subject: "New User", text: `${email}`})
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