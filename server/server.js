
Meteor.publish("groups", function() {
	console.log("Subscribe groups.");
	if (this.userId) {
		var user = Meteor.users.findOne({_id: this.userId});
		if (user){
			return Groups.find({
				$or: [
					{owner: user.username},
					{members: {$in: [user.username]}}
				]
			});
		}
	}
});

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
