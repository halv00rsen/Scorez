
var Schemas = {};

Schemas.User = new SimpleSchema({
	username: {
		type: String,
		optional: false,
		min: 4
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
	}
});

Schemas.User_message = new SimpleSchema({
	group_id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: false
	},
	group_name: {
		type: String,
		optional: false
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
		allowedValues: ["invite"],
		optional: false
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
		optional: false
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
	}
});

Groups = new Mongo.Collection("groups");
User_messages = new Mongo.Collection("user_messages");
System_logs = new Mongo.Collection("system_log");

Meteor.users.attachSchema(Schemas.User);
Groups.attachSchema(Schemas.Group);
User_messages.attachSchema(Schemas.User_message);
System_logs.attachSchema(Schemas.System_log);
