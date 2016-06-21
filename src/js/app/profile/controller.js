"use strict";

//Global service for global variables
angular.module("mean.system").factory("Global", ["$window",
	function($window) {
		var _this = this;
		_this._data = {
			user: window.user,
			authenticated: !!window.user,
			guid: guid,
			back: function() {
				$window.history.back();
			}
		};

		return _this._data;
	}
]);

angular.module("mean.system").controller("ProfileController", ["$scope", "Global", "$sce", "$modal", "User", "UserService", "$translate", "FileUploader", "UserContents", "AgendaCollection", "ArticlesCollection", "AlbumService", "SuggestionsCollection",

	function($scope, Global, $sce, $modal, User, UserService, $translate, FileUploader, UserContents, AgendaCollection, ArticlesCollection, AlbumService, SuggestionsCollection) {

		$scope.global = Global;
		$scope.user = User;
		$scope.userContents = UserContents.content;

		/***
			AVATAR
		***/
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: "/upload/photo",
			autoUpload: true,
			formData: [{
				key: "value"
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			console.info("Complete", item, response);
			$scope.user.avatar = response.path;
		};

		/***
			SKILLS
		***/
		$scope.initSkill = function() {
			$scope.skill = {
				name: "",
				value: ""
			};
		};

		$scope.addSkill = function() {

			if (!$scope.user.skills) {
				$scope.user.skills = [];
			}

			var currentSkill = angular.extend({}, $scope.skill);
			$scope.user.skills.push(currentSkill);
			$scope.initSkill();
		};

		$scope.removeSkill = function(skill) {
			$scope.user.skills.splice($scope.user.skills.indexOf(skill), 1);
		};

		/***
			SETTINGS
		***/
		$scope.changeLanguage = function(key) {
			$translate.use(key);
		};

		/***
			MODEL
		***/
		$scope.update = function() {
			UserService.update($scope.user).then(function(user) {
				$scope.global.user = user;
			});
		};

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return angular.element(html).text();
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.deleteEvent = function(evt, userEvent) {
			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/users/views/modal/deleteContent.html",
				controller: "deleteContentModalCtrl",
				resolve: {
					content: function() {
						return userEvent;
					}
				}
			});

			modalInstance.result.then(function() {
				AgendaCollection.remove(userEvent._id).then(function(){
					$scope.removeItem(userEvent);
				});
			});
		};

		$scope.deleteSuggestion = function(evt, suggestion) {
			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/users/views/modal/deleteContent.html",
				controller: "deleteContentModalCtrl",
				resolve: {
					content: function() {
						return suggestion;
					}
				}
			});

			modalInstance.result.then(function() {
				SuggestionsCollection.remove(suggestion._id).then(function(){
					$scope.removeItem(suggestion);
				});
			});
		};

		$scope.deleteArticle = function(evt, article) {
			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/users/views/modal/deleteContent.html",
				controller: "deleteContentModalCtrl",
				resolve: {
					content: function() {
						return article;
					}
				}
			});

			modalInstance.result.then(function() {
				ArticlesCollection.remove(article._id).then(function(){
					$scope.removeItem(article);
				});
			});
		};

		$scope.deleteAlbum = function(evt, album) {
			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: "js/users/views/modal/deleteContent.html",
				controller: "deleteContentModalCtrl",
				resolve: {
					content: function() {
						return album;
					}
				}
			});

			modalInstance.result.then(function() {
				AlbumService.deleteAlbum(album._id).then(function(){
					$scope.removeItem(album);
				});
			});
		};

		$scope.removeItem = function(item){
			$scope.userContents.splice($scope.userContents.indexOf(item), 1);
		};

		$scope.$parent.menu = {
			title: "Profil",
			items: [{
				link: "#!",
				info: "Retour",
				icon: "fa-arrow-left",
				callback: $scope.global.back
			}, {
				link: "#!",
				info: "Sauvegarder",
				icon: "fa-save",
				callback: $scope.update
			}]
		};

		$scope.initSkill();
	}
]);

angular.module("mean.users").controller("deleteContentModalCtrl", ["$scope", "$modalInstance", "content",

	function($scope, $modalInstance, content) {

		$scope.content = content;

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	}
]);

var ProfileData = {
	User: function(UserService, Global) {
		return UserService.findOne(Global.user._id);
	},

	UserContents: function(HomeCollection) {
		return HomeCollection.getUserDatasFromId();
	}
};