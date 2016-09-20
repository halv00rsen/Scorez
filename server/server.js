
Meteor.startup(function() {
	if (!Meteor.users.findOne()) {
		console.log("Creating default user.");

		defUser = Meteor.settings.DEFAULT_USER;
		userId = Meteor.users.insert({
			username: defUser.USERNAME,
			roles: ["admin"]
		});
		if (userId) {
			Accounts.setPassword(userId, defUser.PASSWORD);
		}
	}
});


Meteor.users.find({ "status.online": true }).observe({
  added: function(id) {
    // id just came online
  },
  removed: function(user) {
    // id just went offline
    Groups.update({
    	members: {
    		$in: [user.username]
    	}
    }, {
    	$pull: {
    		is_typing: user.username
    	}
    }, {multi: true});
  }
});
