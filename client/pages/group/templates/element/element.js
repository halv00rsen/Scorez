
Template.element.helpers({

	is_self: function() {
		return this.username === Meteor.user().username;
	},

	get_current_element: function() {
		// return Session.get("current_element_in_group");
		var current = Session.get("current_element_in_group");
		// console.log(current);
		// console.log(this);
		var group = Groups.findOne({
			_id: this._id,
			// "beers._id": current._id
		});
		for (var i in group.beers) {
			if (group.beers[i]._id === current._id){
				var element = group.beers[i];
				element.have_not_given = true;
				for (var p in element.points) {
					if (Meteor.user().username === element.points[p].username) {
						element.have_not_given = false;
						break;
					}
				}
				return element;
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
	},

	"click #delete_score": function(event, template) {
		Meteor.call("remove_points_given", {
			group_id: Session.get("selected_group")._id,
			beer_id: Session.get("current_element_in_group")._id
		}, function(error, result) {
			if (error) {
				Show_message(error.reason);
			}
		});
	}
});
