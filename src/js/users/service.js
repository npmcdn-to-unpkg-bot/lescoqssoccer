"use strict";

//user service used for user REST endpoint
angular.module("mean.users").factory("Users", ["$resource",
	function($resource) {
		return $resource("users/:userId", {
			userId: "@_id"
		}, {
			update: {
				method: "PUT"
			},
			"query": {
				method: "GET",
				isArray: true
			},
		})
	}
]);

angular.module("mean.users").service("UserService", ["Global", "Users",

	function(Global, Users) {

		var UserService = {

			all: [],

			load: function() {
				return Users.query({}, function(users) {
					UserService.all = users;
				}).$promise;
			},

			findOne: function(userId) {
				return Users.get({
					userId: userId
				}, function(conversation) {
					return conversation;
				}).$promise;
			},

			update: function(user) {
				return Users.update({
					userId: user._id
				}, user, function(data) {
					return data;
				}).$promise;
			},

			addReadArticle: function(articleId){
				if(!_.contains(Global.user.readArticles, articleId)){
					Global.user.readArticles.push(articleId);
					UserService.update(Global.user).then(function(user){
						Global.user = user;
					});
				}
			},

			updateConversation: function(conversationId){
				if(!Global.user.conversations){
					Global.user.conversations = [];
				}

				var conversation = _.findWhere(Global.user.conversations, {conversationId: conversationId});
				if(conversation && conversation.conversationId){
					conversation.lastUpdate = new Date();
				} else{
					Global.user.conversations.push({
						conversationId: conversationId,
						lastUpdate: new Date()
					})
				}

				UserService.update(Global.user).then(function(user){
					Global.user = user;
				});
			},

			addReadVote: function(voteId){
				if(!_.contains(Global.user.readVotes, voteId)){
					Global.user.readVotes.push(voteId);
					UserService.update(Global.user).then(function(user){
						Global.user = user;
					});
				}
			},

			addReadAlbum: function(albumId){
				if(!_.contains(Global.user.readAlbums, albumId)){
					Global.user.readAlbums.push(albumId);
					UserService.update(Global.user).then(function(user){
						Global.user = user;
					});
				}
			}
		};

		return UserService;
	}
]);