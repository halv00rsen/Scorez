
Template.home.helpers({
	get_your_groups: function() {
		return Groups.find({}, {
			sort: {
				name: 1
			}
		});
	},
	is_owner: function(username) {
		return username === Meteor.user().username && !this.locked;
	},
	is_not_owner: function(username) {
		return username !== Meteor.user().username;
	},
	get_locked_groups: function() {
		return Groups.find({locked: true});
	}
});

Template.home.events({
	"click .clickable": function(event, template) {
		Router.go(event.target.parentElement.attributes["name"].value);
	},

	"click .unlock-btn": function(event, template) {
		var id;
		if (!event.target.id) 
			id = event.target.parentElement.id;
		else
			id = event.target.id;

		Meteor.call("unlock_group", {group_id: id}, function(error, result) {
			if (error)
				Show_message(error.reason);

		});
	},

	"click .delete-btn": function(event, template) {
		var id;
		if (!event.target.id) 
			id = event.target.parentElement.id;
		else
			id = event.target.id;

		Meteor.call("delete_group", {
			group_id: id
		}, function(error, result) {
			if (error)
				Show_message(error.reason);
			else
				Show_message(result);
		});
	}
});
