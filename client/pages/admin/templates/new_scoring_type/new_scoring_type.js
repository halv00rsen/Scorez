
Template.new_scoring_type_admin.events({
	"submit form": function(event, template) {
		event.preventDefault();

		var data = {
			name: event.target.scoring_name.value,
			description: event.target.description.value,
			min_point: Number(event.target.min_value.value),
			max_point: Number(event.target.max_value.value),
			multiple_scorez: event.target.multiple_scorez.checked,
			plus_minus: event.target.plus_minus_scorez.checked
		};

		if (data.min_point > data.max_point) {
			Show_message("Max point have to be larger than min point.");
			return;
		}

		Meteor.call("create_group_scoring", data, function(error, result) {
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message("The scoring was saved!");
				event.target.scoring_name.value = "";
				event.target.description.value = "";
				event.target.min_value.value = "";
				event.target.max_value.value = "";
				event.target.multiple_scorez.checked = false;
				event.target.plus_minus_scorez.checked = false;
			}
		});
	}
});
