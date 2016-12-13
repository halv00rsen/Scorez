
Template.new_group.helpers({
	scoring: function() {
		return Group_scorings.find();
	}
});


Template.new_group.events({

	// Add new group to user
	"submit form": function(event, template) {
		// add_new_group
		event.preventDefault();

		var group = {};
		group.name = event.target.group_name.value;
		group.scoring_id = event.target.scoring_types.options[event.target.scoring_types.selectedIndex].value

		if (!group.name) {
			Show_message("Name is required.");
			return;
		}

		Meteor.call("add_new_group", group, function(error, result) {
			if (error) {
				console.log(error);
				Show_message(error.reason);
			} else {
				// event.target.groupname.value = "";
				Router.go("home");
			}
		});
	}
});
