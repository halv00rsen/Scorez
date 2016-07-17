
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
	}
});
