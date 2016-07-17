
Template.new_user_admin.events({
	"submit form": function(event, template) {
		event.preventDefault();
		var username = event.target.username.value;
		var password = event.target.password.value;

		if (!username) {
			Show_message("No username is typed in.");
			return;
		}
		if (!password) {
			Show_message("No password written.");
			return;
		}

		Meteor.call("create_new_user", {
			username: username,
			password: password
		}, function(error, result) {
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message("The user " + username + " was created.");
			}
			event.target.username.value = "";
			event.target.password.value = "";
			event.target.username.focus();
		});
	}
});
