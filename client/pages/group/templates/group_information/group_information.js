
Template.group_information.helpers({
	info: function() {
		var beers = Session.get("beers");
		var group = this;
		var scoring = Group_scorings.findOne({_id: group.scoring});
		var data = {
			name: group.name,
			owner: group.owner,
			num_types: group.types.length,
			num_elements: beers.length,
			scoring: scoring.name,
			score_desc: scoring.description,
			max_point: scoring.max_point,
			min_point: scoring.min_point,
			multiple: scoring.multiple_scorez,
			plus: scoring.plus_minus
		};
		return data;
	}
});
