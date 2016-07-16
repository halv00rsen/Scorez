
Template.home.helpers({
	get_your_groups: function() {
		return Groups.find();
	},
	is_owner: function(username) {
		return username === Meteor.user().username;
	},
	is_not_owner: function(username) {
		return username !== Meteor.user().username;
	}
});

Template.home.events({
	"click .clickable": function(event, template) {
		Router.go(event.target.parentElement.attributes["name"].value);
	}
});
