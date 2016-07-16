
Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render("login");
  } else if (Roles.userIsInRole(Meteor.userId(), 'disabled')) {
    // this.render("disabled");
    this.render("page_not_found");
  } else {
    this.next();
  }
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
