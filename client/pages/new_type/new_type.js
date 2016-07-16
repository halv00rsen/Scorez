
Template.new_type.events({
	"submit form": function(event, template) {
		event.preventDefault();

		var data = {};
		data.type_name = event.target.type_name.value;
		data.group_id = event.target.group_id.value;

		Meteor.call("create_type", data, function(error, result) {
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message("The type was saved.");
			}
		});
	}
});
