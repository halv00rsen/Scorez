
Template.navigation.helpers({
	get_unread_messages: function() {
		var messages = User_messages.find().fetch();
		var counter = 0;
		for (var i in messages) {
			if (!messages[i].is_read)
				counter++;
		}
		return counter;
	}
});

Template.navigation.events({
	"click #logout": function(event, template) {
		Meteor.logout(function() {

		});
	}
});
