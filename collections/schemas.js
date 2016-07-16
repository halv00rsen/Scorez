
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

Schemas.Invite = new SimpleSchema({

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
});

Schemas.Beer = new SimpleSchema({
	name: {
		type: String,
		max: 40,
		min: 2,
		optional: false
	},
	type: {
		type: Schemas.Type,
		blackbox: true
	}
});

Schemas.AccessGroup = new SimpleSchema({
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
		blackbox: true,
		optional: false
	},
	types: {
		type: [Schemas.Type],
		blackbox: true,
		optional: false
	}
});

Groups = new Mongo.Collection("groups");

Meteor.users.attachSchema(Schemas.User);
Groups.attachSchema(Schemas.Group);
