
Meteor.publish("usernames", function() {
	return Meteor.users.find({}, {
		fields: {
			username: 1
			// _id: 0
			// roles: 0,
			// services: 0
		}
	});
});

Meteor.publish("users", function() {
	if (this.userId && Roles.userIsInRole(this.userId, ["admin"])) {
		return Meteor.users.find({});
		// var user = Meteor.users.findOne({_id: this.userId});
		// if (user && Roles.userIsInRole(user, ["admin"])) {

		// }
	}
});

Meteor.publish("private_messages", function() {
	if (this.userId) {
		var user = Meteor.users.findOne({_id: this.userId});
		if (user) {
			return User_messages.find({
				username: user.username
			}, {
				sort: {createdAt: -1}
			});
		}
	}
});

Meteor.publish("groups", function() {
	// console.log("Subscribe groups.");
	if (this.userId) {
		var user = Meteor.users.findOne({_id: this.userId});
		if (user){
			return Groups.find({
				$or: [
					{owner: user.username},
					{members: {$in: [user.username]}}
				],
				locked: false
			});
		}
	}
});


Meteor.publish("deleted_groups", function() {
	if (this.userId) {
		var username = Meteor.users.findOne({_id: this.userId}).username;
		var groups = Groups.find({
			owner: username,
			locked: true
		});
		// console.log("Del groups: " + groups.fetch().length);
		return groups;
	}
});
