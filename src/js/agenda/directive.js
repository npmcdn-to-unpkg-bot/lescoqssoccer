angular.module('mean.agenda').directive('wViewevent', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/agenda/views/view.html'
	}
});

angular.module('mean.agenda').directive('wCreateevent', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/agenda/views/create.html'
	}
});

angular.module('mean.agenda').directive('wEditevent', function () {

	return {
		restrict: 'E',
		templateUrl: 'js/agenda/views/edit.html'
	}
});