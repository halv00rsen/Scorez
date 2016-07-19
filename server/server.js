
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
