
Template.profile.events({
	"submit #change-password": function(event, template) {
		event.preventDefault();

		var current = event.target.currentPassword.value;
		var newPassword = event.target.newPassword.value;
		var reNew = event.target.reNewPassword.value;

		if (newPassword !== reNew) {
			Show_message("Passwords do not match!");
			event.target.currentPassword.value = "";
			event.target.newPassword.value = "";
			event.target.reNewPassword.value = "";
			return;
		}
		Accounts.changePassword(current, newPassword, function(error, result) {
			event.target.currentPassword.value = "";
			event.target.newPassword.value = "";
			event.target.reNewPassword.value = "";
			if (error) {
				Show_message(error.reason);
			} else {
				Show_message("Password was changed.");
			}
		});
	}
});
