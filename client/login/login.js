
Template.login.events({
	"submit form": function(event, template) {
		event.preventDefault();
		var username = event.target.username.value;
		var password = event.target.password.value;

		if (Meteor.user()) {
			Show_message("You are already logged in.");
			return;
		}

		Meteor.loginWithPassword({username: username}, password, function(error) {
			if (error) {
				event.target.password.value = "";
				Show_message("Username or password is incorrect!");
				event.target.password.focus();
			}
		});
	}
});
