
Meteor.publish("usernames", function() {
	if (!this.userId)
		return [];
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
	return [];
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
	return [];
});


Meteor.publish("your_group_names", function() {
	if (this.userId) {
		var user = Meteor.users.findOne({_id: this.userId});
		if (user) {
			return Groups.find({
				$or: [
					{owner: user.username},
					{members: {$in: [user.username]}}
				],
				locked: false 
			}, {
				fields: {
					name: 1,
					owner: 1
				}
			});
		}
	}
	return [];
});


Meteor.publish("invited_users_not_answered", function(group_id) {
	check(group_id, String);

	if (!this.userId) 
		return [];

	var user = Meteor.users.findOne({_id: this.userId});
	var group = Groups.findOne({
		_id: group_id,
		members: {
			$in: [user.username]
		}
	});

	if (!group)
		return [];

	return User_messages.find({
		group_id: group_id,
		type: "invite",
		is_read: false
	}, {
		fields: {
			username: 1
		}
	});
});


Meteor.publish("current_group", function(data) {
	// console.log("Subscribe groups.");

	check(data, {
		is_phone: Boolean,
		override: Boolean,
		owner: String,
		group_name: String
	});

	// console.log(data);

	if (this.userId) {
		var user = Meteor.users.findOne({_id: this.userId});
		if (user){
			if (data.is_phone && !data.override) {
				// console.log("Phone and no override");
				return Groups.find({
					owner: data.owner,
					name: data.group_name,
					locked: false,
					$or: [
						{owner: user.username},
						{members: {$in: [user.username]}}
					]
				}, {
					fields: {
						logs: 0
					}
				});
			} else if (data.is_phone && data.override) {
				// console.log("Phone and override");
				return Groups.find({
					owner: data.owner,
					name: data.group_name,
					locked: false,
					$or: [
						{owner: user.username},
						{members: {$in: [user.username]}}
					]
				}, {
					fields: {
						logs: 1
					}
				});
			}
			// console.log("No phone and no override");
			return Groups.find({
					owner: data.owner,
					name: data.group_name,
					locked: false,
					$or: [
						{owner: user.username},
						{members: {$in: [user.username]}}
					]
			}, {
				// fields: {
				// 	name: 1,
				// 	owner: 1
				// }
			});
		}
	}
	return [];
});


Meteor.publish("deleted_groups", function() {
	if (this.userId) {
		var username = Meteor.users.findOne({_id: this.userId}).username;
		var groups = Groups.find({
			owner: username,
			locked: true
		}, {
			fields: {
				name: 1,
				owner: 1,
				locked: 1
			}
		});
		// console.log("Del groups: " + groups.fetch().length);
		return groups;
	}
	return [];
});
