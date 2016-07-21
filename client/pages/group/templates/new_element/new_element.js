
Template.new_element.rendered = function() {
	$("#elem_name").focus();
}

Template.new_element.helpers({

});


Template.new_element.events({
	"submit form": function(event, template) {
		event.preventDefault();

		var name = event.target.element_name.value;
		var type = event.target.element_type.value;

		var group_id = event.target.group_id.value;

		if (!name){
			Show_message("No name typed.");
			return;
		}
		if (!type) {
			Show_message("No type typed.");
			return;
		}
		if (!group_id) {
			Show_message("Please do not touch the html.");
			return;
		}

		Meteor.call("create_new_element", {
			name: name,
			type: type,
			group_id: group_id
		}, function(error, result) {
			if (error) 
				Show_message(error.reason);
			else{
				Show_message("The element " + name + " was added.");
				// event.target.element_name.value = "";
				// event.target.element_type.value = "";
				Session.set("current_template_group", "all_elements");
			} 

		});
	},

	"click #back_new": function(event, template) {
		Session.set("current_template_group", "all_elements");
	}
});
