
Template.admin.rendered = function() {
	Session.set("current_admin_template", "new_user_admin");
}

Template.admin.helpers({
	get_current_template: function() {
		var temp = Session.get("current_admin_template");
		return temp;
	}
});


Template.admin.events({
	"click .admin_menu_button": function(event, template) {
		var current_id = event.target.id;
		if (current_id) {
			Session.set("current_admin_template", current_id + "_admin");
			template.$(".admin_menu_button").removeClass("open");
			template.$("#" + current_id).addClass("open");
		}
	}
});
