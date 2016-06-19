"use strict";

//Articles service used for Articles REST endpoint
angular.module("mean.system").factory("Home", ["$resource",
	function($resource) {
		return $resource("home", {
			id: "@_id",
		}, {
			"query": {
				method: "GET",
				params: {
					userId: "@userId"
				}
			}
		});
	}
]);

/**
 * ArticleModel service
 **/
angular.module("mean.system").service("HomeCollection", ["Home", "Global",
	function(Home, Global) {
		var HomeCollection = {
			getUserDatas: function() {
				return Home.get({}, function(result) {
					return result;
				}).$promise;
			},
			getUserDatasFromId: function() {
				return Home.query({
					"userId": Global.user._id
				}, function(result) {
					return result;
				}).$promise;
			}
		}
		return HomeCollection;
	}
]);