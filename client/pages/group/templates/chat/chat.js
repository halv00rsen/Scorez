
var get_zero = function(num) {
	if (("" + num).length < 2)
		return "0" + num;
	return "" + num;
}

Template.group_chat.rendered = function() {
	 $('[data-toggle="tooltip"]').tooltip();
	 Session.set("is_typing", false);
}

Template.group_chat.helpers({
	is_self: function(username) {
		return username === get_username();
	},

	has_not_seen_new_messages: function() {
		// console.log(this.chat_messages_seen);
		if (!this.chat_messages_seen)
			return false;
		return this.chat_messages_seen.indexOf(get_username()) == -1;
	},

	scroll_down: function() {
		if ($("#chat-btn-collapse").hasClass("fa-plus")) {
			// $("#plus-sign-chat").show();
		}
		if (!$("#chat-text")[0])
			return;
		var scrollheight = $("#chat-text").scrollTop() + $("#chat-text").height();
		if (scrollheight !== $("#chat-text")[0].scrollHeight) {
			// $("#new-msg").show();
			console.log("Not scrolling to bottom.");
		} else {
			$("#chat-text").animate({
				scrollTop: $("#chat-text")[0].scrollHeight
			}, "slow");
			// $("#new-msg").hide();
			console.log("Scrolling to bottom.");
			if (this.chat_messages_seen.indexOf(get_username()) == -1) {
				console.log("calling doctor love!");
				Meteor.call("set_message_seen_group", {group_id: this._id});
			}
		}
	},
// 
	get_date_pretty: function(date) {
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var today = new Date();
		if (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear()) {
			return "" + get_zero(hour) + ":" + get_zero(minutes);
		}
		return "" + get_zero(date.getDate()) + "." + get_zero(date.getMonth() + 1) + "." + date.getFullYear() + " " + get_zero(hour) + ":" + get_zero(minutes);
	},

	show_typing: function(name) {
		return get_username() !== name;
	}
});


Template.group_chat.events({
	"submit form": function(event, template) {
		event.preventDefault();
		var text = event.target["input-chat"].value;
		if (!text)
			return;
		Meteor.call("send_message_to_group", {
			group_id: this._id,
			text: text
		}, function(error, result) {
			if (error) {
				Show_message(error.reason);
			}
			event.target["input-chat"].value = "";
			template.$("#chat-text").animate({
				scrollTop: $("#chat-text")[0].scrollHeight
			}, "slow");
			Session.set("is_typing", false);
		});
	},

	"click #new-msg": function(event, template) {
		template.$("#chat-text").animate({
			scrollTop: $("#chat-text")[0].scrollHeight
		}, "slow");
		Meteor.call("set_message_seen_group", {group_id: this._id});
		// template.$("#new-msg").hide();
	},

	"keyup #input-chat": function(event, template) {
		// console.log(event.target.value);
		var val = event.target.value;
		var is_typing = Session.get("is_typing");
		if (val && !is_typing) {
			Meteor.call("set_typing_in_chat", {group_id: this._id, typing: true}, function(error, result) {
				if (error)
					console.log(error.reason);
				Session.set("is_typing", true);
			});
		}
		if (!val && is_typing) {
			Meteor.call("set_typing_in_chat", {group_id: this._id, typing: false}, function(error, result) {
				if (error) 
					console.log(error.reason);
				Session.set("is_typing", false);
			});
		}
	}
});

