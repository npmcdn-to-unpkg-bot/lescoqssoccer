'use strict';

//user service used for user REST endpoint
angular.module('mean.system').factory('Parameters', ['$resource',
	function($resource) {
		return $resource('parameters', {
			parameterId: '@_id'
		},{
			update: {
				method: 'PUT',
				params: {
					articleId: '@parameterId'
				}
			},
			query: {
				method: 'GET',
				isArray: true
			},
		})
	}
]);

angular.module('mean.system').service('ParametersService', ['Global', 'Parameters',
	function(Global, Parameters) {
		var ParametersService = {
			parameters: [],
			load: function() {
				return Parameters.query({}, function(parameters) {
					ParametersService.parameters = parameters[0];
				}).$promise;
			},
			update: function(_parameters) {
				return Parameters.update({}, _parameters, function(data) {
					return data;
				}).$promise;
			},
		};
		return ParametersService;
	}
]);
