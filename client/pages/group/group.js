
Template.group.rendered = function() {
	Session.set("current_template_group", "all_elements");
	Session.set("current_template_group_types", "all_types_group");
	Session.set("current_template_group_members", "all_members_admin");
}


Template.group.helpers({
	get_all_elements: function(id) {
		console.log(id);
		return [];
	},

	get_current_template_types: function() {
		return Session.get("current_template_group_types");
	},

	get_group_id: function() {
		return {
			group_id: this._id
		}
	},

	get_current_template_members: function() {
		return Session.get("current_template_group_members");
	},

	get_elements_sorted: function(elements) {

	},

	is_owner: function(owner) {
		if (Meteor.user())
			return owner == Meteor.user().username;
		return false;
	},

	get_current_template: function() {
		var current_template = Session.get("current_template_group");
		if (!current_template){
			Session.set("current_template_group", "all_elements");
			return "all_elements";
		}
		return current_template;
	},

	get_logs: function(logs) {
		logs.reverse();
		return logs.slice(0,10);
	},
	formatDate: function(date) {
	    return moment(date).calendar(null, {
			sameDay: '[Today at] HH:mm',
			lastDay: '[Yesterday at] HH:mm',
			lastWeek: '[Last] dddd [at] HH:mm',
			thisWeek: 'dddd [at] HH:mm',
			sameElse: 'dddd DD/MM/YY [at] HH:mm'
		});
	}
});


Template.group.events({

	"click #new_type": function(event, template) {
		Session.set("current_template_group_types", "new_type");
	},

	"click #new_element_btn": function(event, template) {
		Session.set("current_template_group", "new_element");
	},

	"click #new_member": function(event, template) {
		Session.set("current_template_group_members", "new_member_group");
	},

	"click #delete-btn": function(event, template) {
		Meteor.call("lock_group", {
			group_id: template.$("#group_id_delete").val()
		}, function(error, result) {
			if (error){
				Show_message(error.reason);
			} else {
				Router.go("home");
			}
		});
	}
});	
