
Log_text = function(msg) {
	var date = new Date();
	var dayOfYear = date.getYear() + "." + (date.getMonth() + 1) + "." + date.getDay(); 
	var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
	console.log(dayOfYear + " - " + time + ":\t" + msg);
}

var equal_usernames = function(username1, username2) {
	return username1.toLowerCase() === username2.toLowerCase();
}

Meteor.methods({
	add_new_group: function(group) {

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		check(group, {
			name: String
		});

		group.members = [];
		group.owner = Meteor.user().username;
		group.beers = [];
		group.members.push(Meteor.user().username);
		group.types = [];
		group.chat_messages = [];
		group.is_typing = [];
		group.logs = [{
			text: "Group created.",
			date: new Date(),
			username: Meteor.user().username
		}];
		group.locked = false;

		if (Groups.findOne({
			name: group.name,
			owner: group.owner
		})) {
			throw new Meteor.Error(409, "The group already exists.");
		}

		var id = Groups.insert(group);
		if (id) {
			console.log("Group created. Name: " + group.name + ", Owner: " + group.owner + ".");
		}
	},
	create_type: function(data) {

		if (!Meteor.userId()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		check(data, {
			type_name: String,
			group_id: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			locked: false
		});
		if (!group)
			throw new Meteor.Error(404, "Group not found.");

		var type = {
			name: data.type_name,
			createdBy: Meteor.user().username,
			createdAt: new Date()
		}

		for (var i in group.types) {
			if (group.types[i].name.toLowerCase() === type.name.toLowerCase()){
				throw new Meteor.Error(409, "The type already exists.");
			}
		}

		var id = Groups.update({_id: data.group_id}, {
			$push: {
				types: type,
				logs: {
					text: "The type " + type.name + " was added.",
					date: new Date(),
					username: Meteor.user().username
				}
			}
		});
	},
	create_new_user: function(user) {

		if (!Meteor.user()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		if (!Roles.userIsInRole(Meteor.user(), ["admin"])) {
			throw new Meteor.Error(430, "You do not have access to do this action.");
		}

		check(user, {
			username: String,
			password: String
		});

		if (Meteor.users.findOne({username: user.username})) {
			throw new Meteor.Error(409, "The user '" + user.username + "' already exists.");
		}

		var id = Meteor.users.insert({
			username: user.username,
			roles: ["standard"]
		});

		if (id) {
			Accounts.setPassword(id, user.password);
			Log_text("The user " + user.username + " was created.");
		}
	},


	invite_user_to_group: function(data) {

		if (!Meteor.user()) {
			throw new Meteor.Error(530, "You are not logged in.");
		}

		check(data, {
			username: String,
			group_id: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			locked: false
		});
		if (!group) 
			throw new Meteor.Error(404, "The group does not exists");

		if (group.owner.toLowerCase() !== Meteor.user().username.toLowerCase()) 
			throw new Meteor.Error(403, "You have no access to invite people to this group.");

		if (Meteor.user().username.toLowerCase() === data.username.toLowerCase()) 
			throw new Meteor.Error(400, "Cannot invite yourself.");

		if (!Meteor.users.findOne({username: data.username}))
			throw new Meteor.Error(404, "The user " + data.username + " does not exist.");

		if (group.members.indexOf(data.username) > -1)
			throw new Meteor.Error(400, "The user is already in the group.");

		var invites = User_messages.find({
			username: data.username,
			owner: Meteor.user().username,
			group_id: data.group_id
		}).fetch();

		for (var i in invites) {
			if (!invites[i].is_read)
				throw new Meteor.Error(400, "You have already invited '" + data.username + "' to the group.");
		}

		User_messages.insert({
			username: data.username,
			group_id: data.group_id,
			group_name: group.name,
			owner: Meteor.user().username,
			type: "invite",
			is_read: false
		});
	},

	answer_on_invite: function(data) {

		if (!Meteor.user()) 
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			join: Boolean,
			invite_id: String
		});

		var invite = User_messages.findOne({_id: data.invite_id});

		if (!invite)
			throw new Meteor.Error(404, "Invite not found.");

		if (invite.username !== Meteor.user().username || invite.type !== "invite") {
			throw new Meteor.Error(404, "Invite not found.");
		}

		if (invite.answered_yes !== undefined) 
			throw new Meteor.Error(400, "The invite is already answered.");

		var group = Groups.findOne({_id: invite.group_id});
		if (!group)
			throw new Meteor.Error(404, "The group was not found.");

		if (data.join) {
			if (group.members.indexOf(Meteor.user().username) === -1) {
				Groups.update({_id: group._id}, {
					$push: {
						members: Meteor.user().username,
						logs: {
							text: "The user " + Meteor.user().username + " was added.", 
							date: new Date(),
							username: Meteor.user().username
						}
					}
				});
			}
		}
		User_messages.update({_id: data.invite_id}, {
			$set: {
				answered_yes: data.join,
				is_read: true
			},

		});
	},

	add_point_to_element: function(data) {

		if (!Meteor.user()) 
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			point: Number,
			element: String,
			type: String,
			group_id: String,
			element_id: String
		});

		if (data.point % 1 !== 0 || data.point < 0 || data.point > 100)
			throw new Meteor.Error(400, "Wrong format on point.");

		var group = Groups.findOne({
			_id: data.group_id,
			locked: false
		});

		if (!group) 
			throw new Meteor.Error(404, "Group not found.");

		if (group.members.indexOf(Meteor.user().username) === -1) 
			throw new Meteor.Error(404, "Group not found.");

		var index = -1, points = undefined;
		for (var i in group.beers) {
			if (group.beers[i].name === data.element && group.beers[i].type === data.type) {
				index = i;
				points = group.beers[i].points;
				break;
			}
		}

		if (index === -1)
			throw new Meteor.Error(404, "Element not found.");

		var score = 0;
		for (var i in points) {
			if (points[i].username === Meteor.user().username)
				throw new Meteor.Error(400, "You have given a score to this element before.");
			score += points[i].point;
		}

		score += data.point;

		score = score / (points.length + 1);
		// console.log(data.element + "  " + data.type);
		// console.log(score);

		// var hei = Groups.find({
		// 	_id: data.group_id,
		// 	"beers.name": data.element,
		// 	"beers.type": data.type 
		// }).fetch();

		// for (var i in hei) {
		// 	console.log(hei[i].name);
		// }

		// 	"beers.name": data.element,
		// 	"beers.type": data.type

		Groups.update({
			_id: data.group_id
		}, {
			$push: {
				logs: {
					text: "The element " + data.element + " with type " + data.type + ", got " + data.point + " points.",
					date: new Date(),
					username: Meteor.user().username
				}
			}
		});

		Groups.update({
			_id: data.group_id,
			"beers._id": data.element_id
			// "beers.type": data.type
		}, {
			$push: {
				"beers.$.points": {
					point: data.point,
					username: Meteor.user().username
				}
			},
			$set: {
				"beers.$.score": score.toFixed(2)
			}
		});

	},

	add_role_to_user: function(data) {

		if (!Meteor.user())
			throw new Meteor.Error(530, "You are not logged in.");

		if (!Roles.userIsInRole(Meteor.user(), ["admin"])) {
			throw new Meteor.Error(403, "You do not have access to to this.");
		}

		check(data, {
			user_id: String,
			role: String
		});

		var user = Meteor.users.findOne({_id: data.user_id});

		if (!user)
			throw new Meteor.Error(404, "The user was not found.");

		Roles.addUsersToRoles(user, [data.role]);		
		// return "The user " + user.username + " was added to the role " + data.role;

		user.roles.push(data.role);
		return user;
	},

	remove_role_from_user: function(data) {

		if (!Meteor.user())
			throw new Meteor.Error(530, "You are not logged in.");

		if (!Roles.userIsInRole(Meteor.user(), ["admin"])) {
			throw new Meteor.Error(403, "You do not have access to to this.");
		}

		check(data, {
			user_id: String,
			role: String
		});

		var user = Meteor.users.findOne({_id: data.user_id});

		if (!user)
			throw new Meteor.Error(404, "The user was not found.");

		Roles.removeUsersFromRoles(user, [data.role]);
		var index = user.roles.indexOf(data.role);
		if (index > -1)
			user.roles.splice(index, 1);
		// return "The user " + user.username + " was removed from the role " + data.role;
		return user;

	},

	create_new_element: function(data) {

		if (!Meteor.user()) 
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			name: String,
			type: String,
			group_id: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			locked: false
		});

		if (!group)
			throw new Meteor.Error(404, "Group not found.");

		if (group.members.indexOf(Meteor.user().username) === -1)
			throw new Meteor.Error(404, "Group not found.");

		var type = undefined;
		for (var i in group.types) {
			if (group.types[i].name.toLowerCase() === data.type.toLowerCase()){
				type = group.types[i].name;
				break;
			}
		}

		if (!type)
			throw new Meteor.Error(404, "The type " + data.type + " was not found in this group.");

		for (var i in group.beers) {
			if (group.beers[i].name.toLowerCase() === data.name.toLowerCase() && group.beers[i].type == data.type)
				throw new Meteor.Error(409, "The element " + data.name + " with type " + data.type + " already exist.");
		}

		var id = Groups.update({_id: data.group_id}, {
			$push: {
				beers: {
					name: data.name,
					type: type,
					points: [],
					score: "0",
					_id: Random.id()
				},
				logs: {
					text: "The element " + data.name + " with type " + type + " was added.",
					date: new Date(),
					username: Meteor.user().username
				}
			}
		});
		// console.log(id);
	},

	delete_type_from_group: function(data) {

		if (!Meteor.user())
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			group_id: String,
			type: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			locked: false
		});

		if (!group)
			throw new Meteor.Error(404, "Group not found.");

		// if (group.members.indexOf(Meteor.user().username) === -1) 
		// 	throw new Meteor.Error(403, "Access denied.");

		if (group.owner !== Meteor.user().username){
			throw new Meteor.Error(403, "You are not allowed to do this action.");
		}

		Groups.update({_id: group._id}, {
			$pull: {
				types: {
					name: data.type
				}
			},
			$push: {
				logs: {
					text: "The type " + data.type + " was deleted.",
					date: new Date(),
					username: Meteor.user().username
				}
			}
		});

		return "The type " + data.type + " was deleted.";
	},

	remove_user_from_group: function(data) {

		if (!Meteor.user())
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			username: String,
			group_id: String
		});		

		var group = Groups.findOne({
			_id: data.group_id,
			locked: false
		});

		if (!group)
			throw new Meteor.Error(404, "Group not found.");

		var is_owner = group.owner === Meteor.user().username;
		var del_self = data.username === Meteor.user().username;

		if (is_owner && del_self) {
			throw new Meteor.Error(400, "You cannot delete yourself from your own group.");
		} else if (!is_owner) {
			throw new Meteor.Error(403, "You are not allowed to do this action.");
		}

		Groups.update({_id: data.group_id}, {
			$pull: {
				members: data.username
			},
			$push: {
				logs: {
					text: "The user " + data.username + " was removed from the group.",
					date: new Date(),
					username: Meteor.user().username
				}
			}
		});

		return "The user " + data.username + " was deleted from the group.";
	},

	lock_group: function(data) {

		if (!Meteor.user())
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			group_id: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			owner: Meteor.user().username
		});

		if (!group)
			throw new Meteor.Error(404, "Group not found.");

		Groups.update({_id: data.group_id}, {
			$set: {locked: true},
			$push: {
				logs: {
					text: "The group was locked.",
					date: new Date(),
					username: Meteor.user().username
				}
			}
		});
		// if (Groups.remove({_id: data.group_id}))
		// 	return "The group " + group.name + " was deleted.";
		// else
		// 	throw new Meteor.Error(400, "The group was not deleted.");
	},

	unlock_group: function(data) {

		if (!Meteor.user())
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			group_id: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			owner: Meteor.user().username
		});

		if (!group) 
			throw new Meteor.Error(404, "Group not found.");

		Groups.update({
			_id: data.group_id
		}, {
			$set: {
				locked: false
			},
			$push: {
				logs: {
					text: "The group was unlocked :)",
					date: new Date(),
					username: Meteor.user().username
				}
			}
		});
	},

	send_message_to_group: function(data) {

		if (!Meteor.user()) 
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			group_id: String,
			text: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			locked: false,
			members: {
				$in: [Meteor.user().username]
			}
		});

		if (!group) 
			throw new Meteor.Error(404, "Group not found.");

		var last_msg = group.chat_messages[group.chat_messages.length - 1]; 

		if (last_msg && last_msg.username === Meteor.user().username) {
			if (new Date() - last_msg.info[last_msg.info.length - 1].date < 60000) {
				Groups.update({
					_id: data.group_id,
					"chat_messages._id": last_msg._id
				}, {
					$push: {
						"chat_messages.$.info": {
							date: new Date(),
							text: data.text
						}
					},
					$pull: {
						is_typing: Meteor.user().username
					}
				});
				return;
			}		
		}
		Groups.update({
			_id: data.group_id
		}, {
			$push: {
				chat_messages: {
					_id: Random.id(),
					username: Meteor.user().username,
					info: [{
						date: new Date(),
						text: data.text
					}]
				}
			},
			$pull: {
				is_typing: Meteor.user().username
			}
		});
	},

	set_typing_in_chat: function(data) {

		if (!Meteor.user()) 
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			group_id: String,
			typing: Boolean
		});

		var group = Groups.findOne({
			_id: data.group_id,
			members: {
				$in: [Meteor.user().username]
			}
		});

		if (!group)
			throw new Meteor.Error(404, "Group not found.");

		if (data.typing) {
			if (group.is_typing.indexOf(Meteor.user().username) === -1) {
				Groups.update({_id: data.group_id}, {
					$push: {
						is_typing: Meteor.user().username
					}
				});
			}
		} else {
			Groups.update({_id: data.group_id}, {
				$pull: {
					is_typing: Meteor.user().username
				}
			})
		}
	},

	delete_group: function(data) {

		if (!Meteor.user())
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			group_id: String
		});

		var group = Groups.findOne({
			_id: data.group_id,
			owner: Meteor.user().username
		});

		if (!group) 
			throw new Meteor.Error(404, "Group not found.");

		if (!group.locked) 
			throw new Meteor.Error(400, "This group is not locked.");

		if (Groups.remove({_id: data.group_id}))
			return "The group " + group.name + " was deleted.";
		throw new Meteor.Error(403, "The group was not deleted.");
	},

	log_text: function(text) {
		// check(text, String);
		console.log(text);
	}
});
