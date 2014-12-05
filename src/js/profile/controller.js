'use strict';

angular.module( 'mean.users' ).controller( 'ProfileController', [ '$scope', 'Global', 'Users', '$translate', 'FileUploader',

	function ( $scope, Global, Users, $translate, FileUploader ) {

		$scope.global = Global;
		$scope.user;

		/***
			AVATAR
		***/
		$scope.uploader = new FileUploader( {
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [ {
				key: 'value'
			} ]
		} );

		$scope.uploader.onCompleteItem = function ( item, response, status, headers ) {
			console.info( 'Complete', item, response );
			$scope.user.avatar = response.path;
			$scope.update();
		};

		/***
			SKILLS
		***/
		$scope.percent;
		$scope.max = 10;
		$scope.tmpValue;

		$scope.hoveringOver = function ( value ) {
			$scope.overStar = value;
		};

		$scope.updateSkill = function ( skill ) {
			skill.value = $scope.overStar;
			$scope.overStar = null;
		};

		$scope.addSkill = function ( name, value ) {

			if ( !user.skills )
				user.skills = [];

			$scope.user.skills.push( {
				name: $scope.skillName,
				value: 70
			} );
		};

		/***
			MODEL
		***/
		$scope.load = function () {
			Users.get( {
				userId: Global.user._id
			}, function ( user ) {
				$scope.user = user;
			} );
		};

		$scope.update = function () {
			$scope.user.$update( function ( response ) {
				console.log( response );
			} );
		};

		$scope.changeLanguage = function ( key ) {
			$translate.use( key );
		};
	}
] );