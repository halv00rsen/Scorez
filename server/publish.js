
Meteor.publish("users", function() {

});

Meteor.publish("usernames", function() {
	if (this.userId && Roles.userIsInRole(this.userId, ["admin"])) {
		return Meteor.users.find({}, {
			username: 1
		});
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
				]
			});
		}
	}
});
