"use strict";

angular.module("mean.system").factory("CommentsCollection", ["$resource",
	function($resource) {

		return $resource("comments/:id/", {
			id: "@_id"
		}, {
			query: {
				method: "GET",
				isArray: true
			},
			update: {
				method: "PUT",
				params: {
					_id: "@_id"
				}
			}
		});

	}
]);

angular.module("mean.system").service("CommentService", ["CommentsCollection",
	function(CommentsCollection) {

		var CommentService = {

			all: [],

			getComment: function(id) {
				return CommentsCollection.get({
					id: id,
				}, function(comment) {
					return comment;
				}).$promise;
			},

			getAllComments: function(page) {
				return CommentsCollection.query({
					page: page - 1,
					perPage: CommentService.itemsPerPage
				}, function(comments) {
					CommentService.all = comments;
					return comments;
				}).$promise;
			},

			saveComment: function(comment) {
				return CommentsCollection.save({}, comment, function(data) {
					return data;
				}).$promise;
			},

			updateComment: function(comment) {
				return CommentsCollection.update({
					_id: comment._id
				}, comment, function(data) {
					return data;
				}).$promise;
			},

			deleteComment: function(comment) {
				return CommentsCollection.delete({}, comment, function(data) {
					return data;
				}).$promise;
			}
		};

		return CommentService;
	}
]);