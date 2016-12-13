

Meteor.startup(function() {
	Api = new Restivus({
		version: "v1",
		useDefaultAuth: true,
		prettyJson: true,
		auth: {
			token: "auth.apiKey",
			user: function() {
				return {
					userId: this.request.headers["user-id"],
					token: this.request.headers["login-token"]
				}
			}
		}
	});

	// Api.addCollection(Meteor.users);

	Api.addRoute("users", {authRequired: true}, {
		get: {
			action: function() {
				console.log(this.userId);
				var users = Meteor.users.find({}, {fields: {username: 1}}).fetch();
				return {status: "success", data: users, user_id: this.userId}
			}
		}
	});

	// Api.addRoute("users", {authRequired: true}, {
	// 	get: {
	// 		roleRequired: ["admin"],
	// 		action: function() {
	// 			var users = Meteor.users();
	// 			return {status: "success", data: users}
	// 		}
	// 	}
	// });

});


// if(Meteor.isServer) {
//   Meteor.startup(function () {
//     // Global configuration
//     Api = new Restivus({
//       version: 'v1',
//       useDefaultAuth: true,
//       prettyJson: true
//     });
 
//     // Generates: GET/POST on /api/v1/users, and GET/PUT/DELETE on /api/v1/users/:id 
//     // for Meteor.users collection (works on any Mongo collection)
//     Api.addCollection(Meteor.users);
//     // That's it! Many more options are available if needed...
 
//     // Maps to: POST /api/v1/articles/:id
//     Api.addRoute('articles/:id', {authRequired: true}, {
//       post: {
//         roleRequired: ['author', 'admin'],
//         action: function () {
//           var article = Articles.findOne(this.urlParams.id);
//           if (article) {
//             return {status: "success", data: article};
//           }
//           return {
//             statusCode: 400,
//             body: {status: "fail", message: "Unable to add article"}
//           };
//         }
//       }
//     });
//   });
// }
