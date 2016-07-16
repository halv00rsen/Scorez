
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

		if (Groups.findOne({
			name: group.name,
			owner: group.owner
		})) {
			throw new Meteor.Error(409, "The group already exists.");
		}

		var id = Groups.insert(group);
		if (id)
			console.log("Group created. Name: " + group.name + ", Owner: " + group.owner + ".");
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
			createdBy: Meteor.user().username
		}

		var id = Groups.update({_id: data.group_id}, {
			$push: {types: type}
		})
	}
});