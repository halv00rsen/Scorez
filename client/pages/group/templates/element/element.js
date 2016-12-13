
Template.element.helpers({

	if_self_element: function(){
		return get_username() === this.username;
	},

	get_current_element: function() {
		// return Session.get("current_element_in_group");
		var current = Session.get("current_element_in_group");
		var group = Session.get("selected_group");
		var multiple = Group_scorings.findOne({_id: group.scoring}).multiple_scorez;
		// var group = Groups.findOne({
		// 	_id: this._id,
		// 	// "beers._id": current._id
		// });
		var beers = Session.get("beers");
		var username = get_username();
		for (var i in beers) {
			if (beers[i]._id === current._id){
				var element = beers[i];
				element.have_not_given = true;
				if (!multiple){
					for (var p in element.points) {
						if (username === element.points[p].username) {
							element.have_not_given = false;
							break;
						}
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

	"click .delete_score": function(event, template) {
		
		var data = {
			point_id: this._id,
			group_id: Session.get("selected_group")._id,
			element_id: Session.get("current_element_in_group")._id
		};

		Meteor.call("delete_score_from_element", data, function(error, result) {
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message("The score was deleted.");
			}
		});
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

	}
});
