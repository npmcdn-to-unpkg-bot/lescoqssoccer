'use strict';

//Articles service used for Articles REST endpoint
angular.module('mean.system').factory('Home', ['$resource',
	function($resource) {
		return $resource('home');
	}
]);

/**
 * ArticleModel service
 **/
angular.module('mean.system').service('HomeCollection', ['Home',

	function(Home) {

		var HomeCollection = {

			getUserDatas: function(page) {

				return Home.get({}, function(result) {
					return result;
				}).$promise;
			}
		}

		return HomeCollection;
	}
]);