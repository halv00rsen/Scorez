
Template.all_members_admin.helpers({
	is_owner: function(owner) {
		if (Meteor.user())
			return owner == Meteor.user().username;
		return false;
	},
	is_online: function(username) {
		return Meteor.users.findOne({username: username}).status;
	}
});

Template.all_members_admin.events({
	"click .remove-user-btn": function(event, template) {
		Meteor.call("remove_user_from_group", {
			username: event.target.id,
			group_id: template.$("#group_id_members").val()
		}, function(error, result) {
			if (error) 
				Show_message(error.reason);
			else {
				Show_message(result);
			}
		});
	}
});
