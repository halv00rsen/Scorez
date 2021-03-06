
var subscribe = undefined;

Template.group.destroyed = function() {
	// console.log("destroyed");
	if (subscribe) {
		subscribe.stop();
	}
	delete Session.keys["is_typing"];
	var sel_group = Session.get("selected_group");
	if (sel_group) {
		var id = sel_group._id;
		Meteor.call("set_typing_in_chat", {group_id: id, typing: false}, function(error, result) {
			if (error)
				console.log(error.reason);
		});
	}
	delete Session.keys["current_template_group"];
	delete Session.keys["current_template_group_types"];
	delete Session.keys["current_template_group_members"];
	delete Session.keys["have_subscribed_log_mobile"];
	delete Session.keys["selected_group"];
	delete Session.keys["sort_elements"];
	delete Session.keys["current_element_in_group"];
}

Template.group.created = function() {
	Session.set("current_template_group", "all_elements");
	Session.set("current_template_group_types", "all_types_group");
	Session.set("current_template_group_members", "all_members_admin");
	Session.set("have_subscribed_log_mobile", !Meteor.Device.isPhone());
	
	// Meteor.call("log_text", this);
	// console.log(this);
	// Session.set("logs_show_nums", 4);
	// $("#log-scroll").on("scroll", function(e) {
	// 	// console.log(e);
	// 	console.log("1: " + $("#log-scroll").scrollTop());
	// 	console.log("2: " + $("#log-scroll").prop('scrollHeight'));
	// 	if ($("#log-scroll").scrollTop() + 160 > $("#log-scroll").prop('scrollHeight')) {
	// 		Session.set("logs_show_nums", Session.get("logs_show_nums") + 5);
	// 		console.log("lolas");
	// 	}
	// });
}


Template.group.helpers({
	get_all_elements: function(id) {
		console.log(id);
		return [];
	},

	is_new_messages: function() {
		return this.chat_messages_seen.indexOf(get_username()) == -1;
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
		// return logs.slice(0,Session.get("logs_show_nums"));
		return logs;
	},
	formatDate: function(date) {
	    return moment(date).calendar(null, {
			sameDay: '[Today at] HH:mm',
			lastDay: '[Yesterday at] HH:mm',
			lastWeek: '[Last] dddd [at] HH:mm',
			thisWeek: 'dddd [at] HH:mm',
			sameElse: 'dddd DD/MM/YY [at] HH:mm'
		});
	},

	get_mobile_style: function() {
		return Meteor.Device.isPhone() ? "display: none;": "";
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
	},

	"click #panel-chat-click": function(event, template) {
		var btn = template.$("#chat-btn-collapse");
		if (btn.hasClass("fa-plus")) {
			// $("#new-msg").hide();
			btn.removeClass("fa-plus").addClass("fa-minus");
			template.$("#group-chat-show").show();
			template.$("#chat-text").animate({
				scrollTop: template.$("#chat-text")[0].scrollHeight
			}, "fast");
			if (this.chat_messages_seen.indexOf(get_username()) == -1) {
				Meteor.call("set_message_seen_group", {group_id: this._id});
			}
		} else {
			btn.removeClass("fa-minus").addClass("fa-plus");
			template.$("#group-chat-show").hide();
		}
		// template.$("#plus-sign-chat").hide();
	},

	"click #info-bar-show": function(event, template) {
		var btn = template.$("#info-btn-collapse");
		if (btn.hasClass("fa-plus")) {
			btn.removeClass("fa-plus").addClass("fa-minus");
			template.$("#info-bar").show();
		} else {
			btn.removeClass("fa-minus").addClass("fa-plus");
			template.$("#info-bar").hide();
		}
	},

	"click #panel-log-click": function(event, template) {
		// console.log("heisann");
		// console.log(event.target.hasClass("fa-plus"));
		// console.log(event.target);
		if (!Session.get("have_subscribed_log_mobile")) {
			Session.set("have_subscribed_log_mobile", true);
			// console.log("heisann")
			subscribe = Meteor.subscribe("current_group", {
				is_phone: Meteor.Device.isPhone(),
				override: true,
				owner: this.owner,
				group_name: this.name
			});
		}
		var btn = template.$("#log-button"); 
		if (btn.hasClass("fa-plus")) {
			btn.removeClass("fa-plus").addClass("fa-minus");
			template.$("#log-scroll").show();
		} else {
			btn.removeClass("fa-minus").addClass("fa-plus");
			template.$("#log-scroll").hide();
		}
	}
});	
