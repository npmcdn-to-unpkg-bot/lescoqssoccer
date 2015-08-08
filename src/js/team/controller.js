'use strict';

angular.module('mean.users').controller('TeamController', ['$scope', 'Global', 'Team',
	function($scope, Global, Team) {

		$scope.global = Global;
		$scope.team = Team;

		$scope.showUser = function(evt, user){

			evt.preventDefault();
			evt.stopPropagation();

			//show selected user
		}

	}
]);

angular.module('mean.users').controller('ProfileController', ['$scope', 'Global', 'Users', '$translate', 'FileUploader',

	function($scope, Global, Users, $translate, FileUploader) {

		$scope.global = Global;
		$scope.user = Global.user;

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
			$scope.update();
		};

		/***
			SKILLS
		***/
		$scope.percent;
		$scope.max = 10;

		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
			$scope.percent = 100 * (value / $scope.max);
		};

		$scope.updateSkill = function(skill) {
			skill.value = $scope.overStar;
			skill.percent = 100 * ($scope.overStar / $scope.max);
		};

		$scope.addSkill = function() {

			if (!user.skills){
				user.skills = [];
			}

			$scope.user.skills.push({
				name: this.skillName,
				value: 7,
				percent: 70
			});
		};

		/***
			MODEL
		***/
		$scope.load = function() {
			Users.get({
				userId: Global.user._id
			}, function(user) {
				$scope.user = user;
			});
		};

		$scope.update = function() {
			$scope.user.$update(function(response) {
				Global.user = response;
			});
		};

		$scope.changeLanguage = function(key) {
			$translate.use(key);
		};
	}
]);

var TeamData = {

	Team: function(Users) {
		return Users.query({}, function(users) {
			return users;
		}).$promise;;
	}

};