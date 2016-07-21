
Template.new_type.rendered = function() {
	$("#type_name").focus();
}

Template.new_type.events({
	"click #submit": function(event, template) {
		event.preventDefault();

		var data = {};

		data.type_name = template.$("#type_name").val();
		data.group_id = template.$("#group_id").val();

		Meteor.call("create_type", data, function(error, result) {
			// template.$("#type_name").value = "";
			if (error) {
				Show_message(error.reason);
				return;
			} else {
				Show_message("The type was saved.");
			}
			Session.set("current_template_group_types", "all_types_group");
		});
	},

	"click #cancel": function(event, template) {
		event.preventDefault();

		Session.set("current_template_group_types", "all_types_group");
	}
});
