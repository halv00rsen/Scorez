
Template.all_types_group.helpers({
	is_owner: function() {
		if (Meteor.user())
			return this.owner == Meteor.user().username;
		return false;
	}
});


Template.all_types_group.events({
	"click .delete-btn": function(event, template) {
		var group = template.$("#group_id").val();
		var type = event.target.id;
		// console.log(group + "   " + this._id);
		Meteor.call("delete_type_from_group", {
			group_id: group,
			type: type 
		}, function(error, result) {
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message(result);
			}
		});
	}
});
