
var Schemas = {};

Schemas.User = new SimpleSchema({
	username: {
		type: String,
		optional: false,
		min: 4,
		custom: function() {
			// if (!Meteor.isServer) {
			// 	throw new Meteor.Error(403, "You are not allowed to change username.");
			// }
		}
	},
	roles: {
		type: [String],
		allowedValues: ["standard", "admin", "disabled"],
		optional: false
	},
	// groups: {

	// },
	createdAt: {
		type: Date,
	    autoValue: function() {
	      if (this.isInsert) {
	        return new Date();
	      } else if (this.isUpsert) {
	        return {$setOnInsert: new Date()};
	      } else {
	        this.unset();  // Prevent user from supplying their own value
	      }
	    }
	},
	services: {
	    type: Object,
	    optional: true,
	    blackbox: true
	},
	status: {
		type: Object,
		optional: true,
		blackbox: true
	}
});

Schemas.Messages = new SimpleSchema({
	text: {
		type: String,
		optional: false,
		max: 140
	},
	createdAt: {
		type: Date,
		optional: false
	}
});

Schemas.User_message = new SimpleSchema({
	group_id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: true
	},
	group_name: {
		type: String,
		optional: true
	},
	username: {
		type: String,
		optional: false,
		label: "Who is this message for"
	},
	owner: {
		type: String,
		optional: false
	},
	type: {
		type: String,
		allowedValues: ["invite", "message"],
		optional: false
	},
	message: {
		type: String,
		optional: true
	},
	is_read: {
		type: Boolean,
		optional: false
	},
	answered_yes: {
		type: Boolean,
		optional: true
	},
	createdAt: {
		type: Date,
		optional: false,
	    autoValue: function() {
	      if (this.isInsert) {
	        return new Date();
	      } else if (this.isUpsert) {
	        return {$setOnInsert: new Date()};
	      } else {
	        this.unset();  // Prevent user from supplying their own value
	      }
	    }
	}
});

Schemas.Point = new SimpleSchema({
	point: {
		type: Number,
		min: 0,
		max: 100,
		optional: false
	},
	username: {
		type: String,
		optional:false,
		label: "Who gave the point"
	}
});

Schemas.Type = new SimpleSchema({
	name: {
		type: String,
		optional: false,
		max: 30
	},
	createdBy: {
		type: String,
		optional: false,
		label: "username"
	},
	createdAt: {
		type: Date,
		optional: false
	    // autoValue: function() {
	    //   if (this.isInsert) {
	    //     return new Date();
	    //   } else if (this.isUpsert) {
	    //     return {$setOnInsert: new Date()};
	    //   } else {
	    //     this.unset();  // Prevent user from supplying their own value
	    //   }
	    // }
	},
});

Schemas.Beer = new SimpleSchema({
	_id: {
		type: String,
		optional: false,
		regEx: SimpleSchema.RegEx.Id
	},
	name: {
		type: String,
		max: 40,
		min: 2,
		optional: false
	},
	type: {
		type: String,
		// blackbox: true,
		optional: false
	},
	points: {
		type: [Schemas.Point],
		optional: false
	},
	score: {
		type: String,
		optional: false
	}
});

Schemas.AccessGroup = new SimpleSchema({
	username: {
		type: String,
		optional: false
	} 

});

Schemas.System_log = new SimpleSchema({
	text: {
		type: String,
		optional: false
	},
	date: {
		type: Date,
		optional: false,
		autoValue: function() {
	      if (this.isInsert) {
	        return new Date();
	      } else if (this.isUpsert) {
	        return {$setOnInsert: new Date()};
	      } else {
	        this.unset();  // Prevent user from supplying their own value
	      }
	    }	
	},
	username: {
		type: String,
		optional: false
	}
});

Schemas.Log = new SimpleSchema({
	text: {
		type: String,
		optional: false
	},
	date: {
		type: Date,
		optional: false
	},
	username: {
		type: String,
		optional: false
	}
});

Schemas.Chat_info = new SimpleSchema({
	date: {
		type: Date
	},
	text: {
		type: String
	}
});

Schemas.Chat_message = new SimpleSchema({
	_id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id
	},
	username: {
		type: String
	},
	info: {
		type: [Schemas.Chat_info]
	}
	// date: {
	// 	type: [Date]
	// },
	// text: {
	// 	type: [String]
	// }
});

Schemas.Group = new SimpleSchema({
	name: {
		type: String,
		optional: false
	},
	owner: {
		type: String,
		optional: false,
		label: "username"
	},
	members: {
		type: [String],
		optional: false,
		label: "List of usernames"
	},
	beers: {
		type: [Schemas.Beer],
		// blackbox: true,
		optional: false
	},
	types: {
		type: [Schemas.Type],
		// blackbox: true,
		optional: false
	},
	logs: {
		type: [Schemas.Log],
		optional: false
	},
	locked: {
		type: Boolean,
		optional: false
	},
	chat_messages: {
		type: [Schemas.Chat_message],
		optional: false
	},
	is_typing: {
		type: [String],
		optional: false,
		label: "List of users currently typing."
	},
	chat_messages_seen: {
		type: [String],
		optional: false,
		label: "List of users that have seen the last message sent."
	}
});

Groups = new Mongo.Collection("groups");
User_messages = new Mongo.Collection("user_messages");
System_logs = new Mongo.Collection("system_log");

Meteor.users.attachSchema(Schemas.User);
Groups.attachSchema(Schemas.Group);
User_messages.attachSchema(Schemas.User_message);
System_logs.attachSchema(Schemas.System_log);
