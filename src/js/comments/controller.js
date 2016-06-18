"use strict";

angular.module("mean.system").controller("CommentController", ["$scope", "Global", "$attrs", "$modal", "CommentService",
	function($scope, Global, $attrs, $modal, CommentService) {

		$scope.global = Global;
		$scope.currentReplyId;
		$scope.newComment = "";

		$scope.showAnswerForm = function(evt, comment) {

			evt.preventDefault();
			evt.stopPropagation();

			$scope.currentReplyId = comment._id;
			$scope.reply = comment;

			$("#formAnswer").insertAfter($("#" + $scope.currentReplyId + "-reply"));
		};

		$scope.hideAnswerForm = function(evt) {

			if (evt) {
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.reply = "";
			$scope.replyText = "";
			$scope.currentReplyId = null;
			$("#formAnswer").insertAfter($("#formComment"));
		};

		$scope.addComment = function() {

			if ($scope.newComment !== "") {

				if (!$scope.object.comments) {
					$scope.object.comments = [];
				}
				$scope.object.comments.push({
					user: $scope.global.user._id,
					content: $scope.newComment,
					created: moment(new Date()).toISOString()
				});

				$scope.updateMethod().then(function(newObject) {

					$scope.object.comments = newObject.comments;
					$scope.object.__v = newObject.__v;
					$scope.newComment = "";

					// add comment object
					CommentService.saveComment({
						user: $scope.global.user._id,
						contentType: $scope.getTypeFromItem(),
						contentId: $scope.object._id
					}).then(function(comment) {
						console.warn("Succesfully add comment object :");
						console.warn(comment)
					});
				});
			}
		};

		$scope.addReply = function() {

			if ($scope.replyText !== "") {
				$scope.reply.replies.push({
					user: $scope.global.user._id,
					content: $scope.replyText,
					created: moment(new Date()).toISOString()
				});

				$scope.hideAnswerForm();
				$scope.updateMethod().then(function(newObject) {
					$scope.object.comments = newObject.comments;
					$scope.object.__v = newObject.__v;
				});
			}
		};

		$scope.showUserDetail = function(evt, user) {

			evt.preventDefault();
			evt.stopPropagation();

			$modal.open({
				templateUrl: "js/users/views/modal/userDetail.html",
				controller: "UserDetailController",
				windowClass: "userDetailPopup",
				resolve: {
					User: function(UserService) {
						return UserService.findOne(user._id);
					},

					Albums: function(AlbumService) {
						return AlbumService.getAlbumsByUser(user._id).then(function(albums) {
							return albums;
						});
					},

					UserArticles: function(ArticlesCollection) {
						return ArticlesCollection.getArticlesByUser(user._id).then(function(articles) {
							return articles;
						});
					},
				}
			});
		};

		$scope.getTypeFromItem = function() {
			if ($scope.object.type && $scope.object.description) {
				return $scope.object.type;
			} else if ($scope.object.photoList) {
				return "album";
			} else if ($scope.object.bets) {
				return "match";
			} else if ($scope.object.eventType) {
				return "userEvent";
			}
			return ""
		};
	}
]);