angular.module("mean.articles").filter("formattedDate", function() {
	return function(d) {
		return d ? moment(d).fromNow() : "";
	};
});


angular.module("mean.articles").filter("formattedFullDate", function() {
	return function(d) {
		return d ? moment(d).format("MMMM Do YYYY, h:mm a") : "";
	};
});

angular.module("mean.articles").filter("reverse", function() {
	return function(items) {
		return items.slice().reverse();
	};
});

angular.module("mean.system").filter("orderConversations", function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});
		filtered.sort(function(a, b) {
			return (a.conversation.messages.length > b.conversation.messages.length || a.userId === "all" ? -1 : 1);
		});
		return filtered;
	};
});