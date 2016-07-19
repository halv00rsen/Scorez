
Template.user_admin.helpers({
	get_current_user: function() {
		var user_id = Session.get("current_user_admin")._id;
		// return Session.get("current_user_admin");
		return Meteor.users.findOne({_id: user_id});
	},

	format_date: function(date) {
		return Methods.format_date(date);
	},

	userIsInRole: function(role) {
		return _.contains(this.roles, role);
	}
});


Template.user_admin.events({
	"click #back": function(event, template) {
		delete Session.keys["current_user_admin"];
		Session.set("current_admin_template", "user_handling_admin");
	},

	"click .admin-btn": function(event, template) {
		var func = event.target.id === "remove_admin" ? "remove_role_from_user": "add_role_to_user";
		// console.log(this.username);
		Meteor.call(func, {
			user_id: this._id,
			role: "admin"
		}, function(error, result) {
			if (error) {
				Show_message(error.reason);
			} else {
				// Show_message(result);
				// Session.set("current_user_admin", result);
			}
		});
		// console.log(remove);
		// console.log(this._id);
	},

	"click .disable-btn": function(event, template) {
		var func = event.target.id === "enable" ? "remove_role_from_user": "add_role_to_user";
		// console.log("Heisann!");
		Meteor.call(func, {
			user_id: this._id,
			role: "disabled"
		}, function(error, result) {
			if (error) {
				Show_message(error.reason);
			} else {
				// Show_message(result);
				// Session.set("current_user_admin", result);
			}
		});
	}
});
