
Router.configure({
  layoutTemplate:"layout",
  notFoundTemplate:"page_not_found",
  loadingTemplate: 'loading'
  // loadingTemplate: 'loading'
});

Router.route("/profile", {
	name: "profile",
	template: "profile"
});

// Router.onBeforeAction(function() {
// 	// console.log("OnBefore");
// 	console.log(Meteor.user());
// 	if (!Meteor.user()) {
// 		Router.go("login");
// 	} else {
// 		this.next();
// 	}
// });

Router.route("/login", {
	layoutTemplate: null,
	name: "login",
	template: "login"
	// onBeforeAction: function() {
	// 	// console.log("Login");
	// 	if (Meteor.user()) {
	// 		Router.go("home");
	// 	} 
	// 	this.next();
	// }
});

Router.route("/", {
	name: "home",
	template: "home",
	waitOn: function() {
		console.log("Waiting on home.");
		if (!Meteor.userId())
			return;
		return [
			this.subscribe("deleted_groups"),
			this.subscribe("your_group_names")
		];
	},
	subscriptions: function() {

	}
});

Router.route("/loading", {
	name: "loading",
	template: "loading"
})

Router.route("/new_group", {
	name: "new_group",
	template: "new_group",
	subscriptions: function() {
		this.subscribe("group_scorings");
	}
});


Router.route("/group/:username/:group/settings", function() {
	if (!this.ready()) {
		return;
	}

	const username = this.params.username;
	const group_name = this.params.group;

	const group = Groups.findOne({

	});

	if (!group) {
		this.render("page_not_found");
	}
	else {
		
	}
});


Router.route("/group/:username/:group", function() {
	// console.log(this.ready());
	if (!this.ready())
		return;
	var username = this.params.username;
	var group_name = this.params.group;

	var group = Groups.findOne({
		// owner: username,
		// name: group_name,
		// locked: false
	});
	// console.log(group);
	// Meteor.call("log_text", username + "   " + group_name);
	// console.log("heisann");
	// var hash = this.params.query;
	// Session.set("query", hash);
	// console.log("this is hash.");
	// console.log(hash);
	// if (!hash.current_template) {
		
	// }

	if (!group) {
		this.render("page_not_found");
	} 
	else {
		this.subscribe("users_online_in_group", group._id);
		this.subscribe("users_invited", {group_id: group._id});
		// console.log(group);
		Session.set("selected_group", group);
		Session.set("beers", Elements.find({group_id: group._id}).fetch());
		this.render("group", {data: group});
	}
}, {
	name: "group",
	// loadingTemplate: 'loading',
	waitOn: function() {
		console.log("is waiting...");
		// console.log("Phone: " + Meteor.Device.isPhone());
		// Meteor.call("log_text", "Phone: " + Meteor.Device.isPhone());
		var is_phone = Meteor.Device.isPhone();
		if (is_phone === undefined) {
			is_phone = true;
		} 
		return Meteor.subscribe("current_group", {
			is_phone: is_phone,
			override: false,
			owner: this.params.username,
			group_name: this.params.group
		});
	},
	subscriptions: function() {
		// this.subscribe()
	}
});

// Router.route("/new_element/:username/:group", function() {
// 	var username = this.params.username;
// 	var group_name = this.params.group;

// 	var group = Groups.findOne({
// 		owner: username,
// 		name: group_name
// 	});

// 	if (!group) {
// 		this.render("page_not_found");
// 	} else {
// 		this.render("new_element", {data: group});
// 	}

// }, {
// 	name: "new_element",
// 	template: "new_element"
// });

// Router.route("/new_type/:username/:group", function() {
// 	var username = this.params.username;
// 	var group_name = this.params.group;

// 	var group = Groups.findOne({
// 		owner: username,
// 		name: group_name
// 	});

// 	if (!group) {
// 		this.render("page_not_found");
// 	} else {
// 		this.render("new_type", {data: group});
// 	}

// }, {
// 	name: "new_type",
// 	template: "new_type"
// });


Router.route("/admin", {
	name: "admin",
	template: "admin",
	subscriptions: function() {
		this.subscribe("users");
		this.subscribe("group_scorings");
		// this.subscribe("groups");

		// this.subscribe("groups").wait();
	},
	onBeforeAction: function() {
		if (Roles.userIsInRole(Meteor.user(), ["admin"]))
	      this.next();
	    else
	      this.render("page_not_found");
	}
});

Router.route("/messages", {
	name: "messages",
	template: "messages",
	subscriptions: function() {
		this.subscribe("chat_messages");
	}
});

// Router.route("/", function() {
// 	// console.log("Home");
// 	this.render("home");
// }, {name: "home"});



// Router.route("/login", function() {
// 	console.log("login");
// 	if (Meteor.user()) {
// 		Router.go("home");
// 	} else {
// 		this.render("login");
// 	}
// }, {name: "login"});
