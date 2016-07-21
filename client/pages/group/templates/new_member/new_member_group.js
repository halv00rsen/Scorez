
Template.new_member_group.events({
	"click #back_member": function(event, template) {
		Session.set("current_template_group_members", "all_members_admin");
	},

	"submit #invite": function(event, template) {
		event.preventDefault();
		var username = event.target.username.value;
		var id = event.target.group_id.value;

		if (!username){
			Show_message("Type in a username to invite.");
			return;
		}

		if (!id) {
			Show_message("Please do not edit the html.");
			return;
		}

		Meteor.call("invite_user_to_group", {
			username: username,
			group_id: id
		}, function(error, result) {
			event.target.username.value = "";
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message("The user " + username + " was invited.");
				Session.set("current_template_group_members", "all_members_admin");
			}
		});
	}
});
