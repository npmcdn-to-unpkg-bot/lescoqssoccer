'use strict';

angular.module('mean.users').controller('TeamController', ['$scope', 'Global', 'Team', '$modal',
	function($scope, Global, Team, $modal) {

		$scope.global = Global;
		$scope.team = Team;

		$scope.showUserDetail = function(evt, user) {

			evt.preventDefault();
			evt.stopPropagation();

			$modal.open({
				templateUrl: 'js/users/views/modal/userDetail.html',
				controller: 'userDetailController',
				windowClass: 'userDetailPopup',
				resolve: {
					User: function() {
						return user;
					}
				}
			});
		};

	}
]);

angular.module('mean.agenda').controller('userDetailController', ['$scope', '$modalInstance', 'User',

	function($scope, $modalInstance, User) {

		$scope.user = User;

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);


angular.module('mean.users').controller('ProfileController', ['$scope', 'Global', 'User', '$translate', 'FileUploader',

	function($scope, Global, User, $translate, FileUploader) {

		$scope.global = Global;
		$scope.user = User;

		/***
			AVATAR
		***/
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			console.info('Complete', item, response);
			$scope.user.avatar = response.path;
		};

		/***
			SKILLS
		***/
		$scope.initSkill = function() {
			$scope.skill = {
				name: "",
				value: 50
			};
		};

		$scope.addSkill = function() {

			if (!$scope.user.skills) {
				$scope.user.skills = [];
			}

			var currentSkill = angular.extend({}, $scope.skill);
			$scope.user.skills.push(currentSkill);
			$scope.initSkill();

			$scope.triggerResize();
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
			$scope.user.$update(function(response) {
				Global.user = response;
			});
		};

		$scope.triggerResize = function(){
			$(window).trigger('resize');
		};

		$scope.initSkill();
	}
]);

var TeamData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;;
	}

};

var ProfileData = {

	User: function(Users, Global) {
		return Users.get({
			userId: Global.user._id
		}, function(user) {
			return user;
		}).$promise;;
	}

};