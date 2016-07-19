
Template.user_handling_admin.helpers({
	get_users: function() {
		return Meteor.users.find();
	},
	format_date: function(date) {
		return Methods.format_date(date);
	}
});


Template.user_handling_admin.events({
	"click .user": function(event, template) {
		var username = event.target.parentElement.id;
		// console.log(username);
		Session.set("current_user_admin", Meteor.users.findOne({username: username}));
		Session.set("current_admin_template", "user_admin");
	}
});
