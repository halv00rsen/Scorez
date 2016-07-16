
Template.new_group.events({

	// Add new group to user
	"submit form": function(event, template) {
		// add_new_group
		event.preventDefault();

		var group = {};
		group.name = event.target.groupname.value;

		if (!group.name) {
			Show_message("Name is required.");
			return;
		}

		Meteor.call("add_new_group", group, function(error, result) {
			if (error) {
				console.log(error);
				Show_message(error.reason);
			} else {
				event.target.groupname.value = "";
				Router.go("home");
			}
		});
	}
});
