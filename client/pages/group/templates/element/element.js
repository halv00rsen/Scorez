
Template.element.helpers({
	get_current_element: function() {
		// return Session.get("current_element_in_group");
		var current = Session.get("current_element_in_group");
		var group = Groups.findOne({
			_id: this._id,
			// "beers._id": current._id
		});
		for (var i in group.beers) {
			if (group.beers[i]._id === current._id){
				return group.beers[i];
			}
		}
		return;
		// console.log(hei);
		// return Groups.findOne({
		// 	_id: this._id,
		// 	"beers.$._id": current._id
		// });
	}
});


Template.element.events({
	"click #back": function(event, template) {
		Session.set("current_template_group", "all_elements");
	},
	"submit form": function(event, template) {
		event.preventDefault();
		var point = Number(event.target.score.value);
		if (isNaN(point) || point % 1 !== 0) {
			Show_message("Please write in an integer.");
			event.target.score.value = "";
			return;
		}
		var current_element = Session.get("current_element_in_group");
		var current_group = Session.get("selected_group");

		Meteor.call("add_point_to_element", {
			point: point,
			element: current_element.name,
			type: current_element.type,
			group_id: current_group._id,
			element_id: current_element._id
		}, function(error, result) {
			if (error) 
				Show_message(error.reason);
			else 
				Show_message("The points was given.");
			event.target.score.value = "";
		});

		// point: Number,
		// 	element: String,
		// 	type: String,
		// 	group_id: String
	}
});
