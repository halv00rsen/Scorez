
Template.group.rendered = function() {
	Session.set("current_template_group", "all_elements");
}


Template.group.helpers({
	get_all_elements: function(id) {
		console.log(id);
		return [];
	},

	get_elements_sorted: function(elements) {

	},

	is_owner: function(owner) {
		return owner == Meteor.user().username;
	},

	get_current_template: function() {
		var current_template = Session.get("current_template_group");
		if (!current_template){
			Session.set("current_template_group", "all_elements");
			return "all_elements";
		}
		return current_template;
	},

	get_logs: function(logs) {
		// logs.reverse();
		return logs.slice(0,10);
	}

});


Template.group.events({
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
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message("The user " + username + " was invited.");
			}
			event.target.username.value = "";
		});

	}
});	
