
Router.configure({
  layoutTemplate:"layout",
  notFoundTemplate:"page_not_found"
  // loadingTemplate: 'loading'
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
	template: "login",
	onBeforeAction: function() {
		// console.log("Login");
		if (Meteor.user()) {
			Router.go("home");
		} 
		this.next();
	}
});

Router.route("/", {
	name: "home",
	template: "home",
	subscriptions: function() {
		// this.subscribe("groups");

		// this.subscribe("groups").wait();
	}
});

Router.route("/new_group", {
	name: "new_group",
	template: "new_group"
});

Router.route("/group/:username/:group", function() {
	var username = this.params.username;
	var group_name = this.params.group;

	var group = Groups.findOne({
		owner: username,
		name: group_name
	});

	if (!group) {
		this.render("page_not_found");
	} 
	else {
		Session.set("selected_group", group);
		this.render("group", {data: group});
	}
}, {
	name: "group"
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
		this.subscribe("usernames");
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
	template: "messages"
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
