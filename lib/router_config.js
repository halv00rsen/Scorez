
// Router.onBeforeAction(function() {
// 	console.log("Hei.!");
// 	console.log(Meteor.userId());
//   	if (!Meteor.userId()) {
//   		console.log("LOLLAS KIS; DETTE FUNKER IKKE!");
//     	this.render("login");
//   	} else if (Roles.userIsInRole(Meteor.userId(), 'disabled')) {
//     // this.render("disabled");
//     	this.render("disabled");
//   	} else {
//     	this.next();
//   	}
// });

Router.onBeforeAction(function() {
	console.log("login before.");
	if (Meteor.userId()) {
		if (Roles.userIsInRole(Meteor.userId(), 'disabled')) {
			this.render("disabled");
		} else {
			Router.go("home");
		}
	} else {
		this.next();
	}
}, {
	only: ["login"]
});

Router.onBeforeAction(function() {
	console.log("else before.");
	if (!Meteor.userId()) {
    	Router.go("login");
  	} else if (Roles.userIsInRole(Meteor.userId(), 'disabled')) {
    	this.render("disabled");
  	} else {
    	this.next();
  	}
}, {
	except: ["login"]
});

// Router.onBeforeAction(function() {
//   if (!Roles.userIsInRole(Meteor.userId(), 'admin')) {
//     this.render("access_denied");
//   } else {
//     this.next();
//   }
// },
// {
//   only: ['admin', 'user']
// });
