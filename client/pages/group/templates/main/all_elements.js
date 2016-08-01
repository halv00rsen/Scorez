
Template.all_elements.rendered = function() {
	Session.set("sort_elements", {
		sort: "score",
		asc: true
	});
	$(".sticky-header").floatThead({
		scrollContainer: function(table) {
     	   return table.closest('.wrapper');
    	}
    	// enableAria: function
	});
	// $(".sticky-header").floatThead('reflow')
}

Template.all_elements.helpers({
	get_beers_sorted: function(beers) {
		if (!beers)
			return;
		// console.log("Sort!");
		beers.sort(function(a, b) {
			var data = Session.get("sort_elements");
			if (!data) {
				data = {
					asc: true,
					sort: "score"
				}
			}
			if (!data.asc) {
				var sb = b;
				b = a;
				a = sb;
			}
			if (data.sort === "score") {
				if (b.score === a.score) {
					if (b.name > a.name)
						return -1;
					return 1;
				}
				return b.score - a.score;
			} else if (data.sort === "name") {
				if (b.name > a.name) {
					return -1;
				} else if (b.name < a.name) {
					return 1;
				} 
				return b.score - a.score;
			} else if (data.sort === "type") {
				if (b.type > a.type) {
					return -1;
				}
				return 1;
			}
		});
		return beers;
	},

	have_answered: function(data) {
		var username = Meteor.user().username;
		for (var i in data.points) {
			if (data.points[i].username === username)
				return true;
		}
		return false;
	}
});


Template.all_elements.events({
	"click .clickable": function(event, template) {
		var name = event.target.parentElement.getAttribute("name").split(":");
		var group = Session.get("selected_group");

		if (!group) {
			Show_message("Please do not touch the html.");
			return;
		}

		for (var i in group.beers) {
			if (group.beers[i].name === name[0] && group.beers[i].type === name[1]) {
				Session.set("current_element_in_group", group.beers[i]);
				Session.set("current_template_group", "element");
				return;
			}
		}
		Show_message("Something wrong has happened.");
	},

	"click .title-sort": function(event, template) {
		var sort = event.target.id;
		// console.log(event.target.parentElement.id);
		// console.log(event.target.id);
		var data = Session.get("sort_elements");
		template.$(".sort-icons").addClass("disabled");
		if (data.sort === sort) {
			data.asc = !data.asc;
			Session.set("sort_elements", data);
		} else {
			data.asc = true;
			Session.set("sort_elements", {
				sort: sort,
				asc: true
			});
		}
		template.$("#" + sort + (data.asc ? "-asc": "-desc")).removeClass("disabled");
	}

});
