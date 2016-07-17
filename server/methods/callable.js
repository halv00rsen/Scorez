
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
		group.logs = [];

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

		var group = Groups.findOne({_id: data.group_id});
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

		var group = Groups.findOne({_id: data.group_id});
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
					$push: {members: Meteor.user().username}
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

		var group = Groups.findOne({_id: data.group_id});

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

	create_new_element: function(data) {

		if (!Meteor.user()) 
			throw new Meteor.Error(530, "You are not logged in.");

		check(data, {
			name: String,
			type: String,
			group_id: String
		});

		var group = Groups.findOne({_id: data.group_id});

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
	}
});
