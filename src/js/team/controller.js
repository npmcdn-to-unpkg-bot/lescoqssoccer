'use strict';

angular.module('mean.users').controller('TeamController', ['$scope', 'Global', 'Team',
	function($scope, Global, Team) {

		$scope.global = Global;
		$scope.team = Team;

		$scope.showUser = function(evt, user) {

			evt.preventDefault();
			evt.stopPropagation();

			//show selected user
		}

	}
]);

angular.module('mean.users').controller('ProfileController', ['$scope', 'Global', 'User', '$translate', 'FileUploader',

	function($scope, Global, User, $translate, FileUploader) {

		$scope.global = Global;
		$scope.user = User;
		$scope.skill = {
			name: "",
			value: 50
		};

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

			var currentSkill = $scope.skill;
			$scope.user.skills.push(currentSkill);

			setTimeout(function() {
				$("[name='" + currentSkill.name + "']").animate({
					width: currentSkill.value + "%"
				}, 1000);
			});

			$scope.initSkill();

		};

		$scope.removeSkill = function(index) {
			$scope.user.skills.splice(index, 1);
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