angular.module('mean.articles').filter('formattedDate', function() {
	return function(d) {
		return d ? moment(d).fromNow() : '';
	};
});


angular.module('mean.articles').filter('formattedFullDate', function() {
	return function(d) {
		return d ? moment(d).format('MMMM Do YYYY, h:mm a') : '';
	};
});

angular.module('mean.articles').filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});