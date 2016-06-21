"use strict";

angular.module("mean.suggestions").controller("SuggestionController", ["$scope", "$location", "Global", "Suggestions", "SuggestionsCollection", "Page", "$modal",
	function($scope, $location, Global, Suggestions, SuggestionsCollection, Page, $modal) {

		$scope.global = Global;
		$scope.suggestions = Suggestions;

		//Manage pagination
		$scope.page = parseInt(Page);
		$scope.totalItems = SuggestionsCollection.all.length;
		$scope.itemsPerPage = SuggestionsCollection.itemsPerPage;

		$scope.pageChanged = function(newPage) {
			$location.path((newPage === 1) ? "/suggestions" : "/suggestions/" + newPage);
		};

		$scope.vote = function(suggestion, value) {

			if (!$scope.hasUserAnswered(suggestion)) {
				switch (value) {
					case 1:
						if (!suggestion.yes) suggestion.yes = [];
						suggestion.yes.push($scope.global.user._id);
						break;
					case 2:
						if (!suggestion.blank) suggestion.blank = [];
						suggestion.blank.push($scope.global.user._id);
						break;
					case 3:
						if (!suggestion.no) suggestion.no = [];
						suggestion.no.push($scope.global.user._id);
						break;
				}

				SuggestionsCollection.update(suggestion).then(function(suggestion) {
					var modalInstance = $modal.open({
						templateUrl: "js/suggestions/views/votedModal.html",
						controller: "votedCtrl",
						resolve: {
							SuggestionId: function() {
								return suggestion._id;
							}
						}
					});
				});

			} else {
				var modalInstance = $modal.open({
					templateUrl: "js/suggestions/views/votedModal.html",
					controller: "votedCtrl",
					resolve: {
						SuggestionId: function() {
							return suggestion._id;
						}
					}
				});
			}
		};

		$scope.getSuggestionAnswerLength = function(suggestion, option) {
			if (suggestion.yes.length + suggestion.no.length + suggestion.blank.length === 0) {
				return 0;
			} else {
				return Math.round(suggestion[option].length / (suggestion.yes.length + suggestion.no.length + suggestion.blank.length) * 100);
			}
		};

		$scope.hasUserAnswered = function(suggestion) {
			return _.contains(_.union(suggestion.yes, suggestion.no, suggestion.blank), $scope.global.user._id);
		};

		$scope.getDays = function(suggestion) {
			return moment(suggestion.created).add(1, "months").fromNow();
		};

		$scope.$parent.menu = {
			title: "Votes",
			items: [{
				link: "#!/suggestions/create",
				info: "Nouveau vote",
				icon: "fa-plus"
			}]
		};
	}
]);

angular.module("mean.suggestions").controller("CreateSuggestionController", ["$scope", "$location", "Global", "Suggestion", "SuggestionsCollection", "$modal",
	function($scope, $location, Global, Suggestion, SuggestionsCollection, $modal) {

		$scope.global = Global;
		$scope.suggestion = Suggestion;

		$scope.create = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.suggestion.content !== "") {
				if ($scope.suggestion._id) {
					SuggestionsCollection.update($scope.suggestion).then(function() {
						$scope.content = "";
						$location.path("/suggestions");
					});
				} else {
					SuggestionsCollection.add($scope.suggestion).then(function() {
						$scope.content = "";
						$location.path("/suggestions");
					});
				}
			} else {
				var modalInstance = $modal.open({
					templateUrl: "js/articles/views/modal/noTitleArticleModalCtrl.html",
					controller: "noTitleModalCtrl"
				});
			}
		};

		$scope.$parent.menu = {
			title: "Nouveau vote",
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}, {
				link: "#!",
				info: "Sauvegarder",
				icon: "fa-save",
				callback: $scope.create
			}]
		};
	}
]);

angular.module("mean.suggestions").controller("votedCtrl", ["$scope", "$modalInstance", "UserService", "SuggestionId",
	function($scope, $modalInstance, UserService, SuggestionId) {
		$scope.ok = function(result) {
			//set vote like read
			UserService.addReadVote(SuggestionId);
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			//set vote like read
			UserService.addReadVote(SuggestionId);
			$modalInstance.dismiss("cancel");
		};
	}
]);

angular.module("mean.system").controller("noTitleModalCtrl", ["$scope", "$modalInstance",
	function($scope, $modalInstance) {
		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

var SuggestionsData = {
	Suggestions: function(SuggestionsCollection, $route) {
		var page = $route.current.params.page || 1;
		return SuggestionsCollection.load(page);
	},
	Page: function($route) {
		return ($route.current.params.page) ? $route.current.params.page : 1;
	}
};

var SuggestionData = {
	Suggestion: function(SuggestionsCollection, $route) {
		return ($route.current.params.id) ? SuggestionsCollection.findOne($route.current.params.id) : {
			content: "",
			yes: [],
			no: [],
			blank: []
		};
	}
};