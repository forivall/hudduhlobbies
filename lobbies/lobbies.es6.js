const Lobbies = new Mongo.Collection("lobbies");

if (Meteor.isClient) {

  Template.body.helpers({
    lobbies: function() {
      return Lobbies.find({lookingForPlayers: true});
    }
  });

  Template.body.events({
    'click .update-profile': function(event) {
      Meteor.call('updateProfile', Meteor.user());
    },
    'click .create-lobby': function(event) {
      $('#create-lobby').modal('show')
    }
  })
}

if (Meteor.isServer) {
  // let AccountsServiceConfiguration = new Mongo.Collection("meteor_accounts_loginServiceConfiguration");

  Meteor.startup(function() {
    // code to run on server at startup
  });

  Meteor.methods({
    updateProfile: function(user) {
      let userServices, steamId;
      if (!user || !(userServices = user.services) || !(userServices.steam && (steamId = userServices.steam.id))) { return; }
      let identity = Steam.getIdentity(steamId);
      Meteor.users.update({_id: user._id}, {$set: {'profile.name': identity.personaname}});
      return identity;
    }
  })
}
