'use strict';

//user service used for user REST endpoint
angular.module('mean.users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			'query': {
				method: 'GET',
				isArray: true
			},
		})
	}
]);

//user service used for user REST endpoint
angular.module('mean.users').factory('Conversations', ['$resource',
	function($resource) {
		return $resource('conversation/:conversationId', {
			conversationId: '@_id'
		}, {
			'save': {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			},
			'query': {
				method: 'GET',
				isArray: true
			},
		})
	}
]);

angular.module('mean.users').service('ConversationService', ['Conversations',

	function(Conversations) {

		var ConversationService = {

			all: [],

			load: function(callback) {
				return Conversations.query({}, function(conversations) {
					ConversationService.all = conversations;
				}).$promise;
			},

			getConversation: function(user1, user2) {

				var usersIds;
				var conversation, conversations;

				if(user1 === "all" || user2 === "all"){
					conversations = _.filter(ConversationService.all, function(conversation){
						return conversation.users.length === 0;
					});

					conversation = (conversations.length > 0) ? conversations[0] : {
						users: [],
						messages: []
					};

				} else {
					conversations = _.filter(ConversationService.all, function(conversation) {
						usersIds = _.pluck(conversation.users, "_id");
						return _.contains(usersIds, user1) && _.contains(usersIds, user2);
					});

					conversation = (conversations.length > 0) ? conversations[0] : {
						users: [user1, user2],
						messages: []
					};
				}

				return conversation;
			},

			findOne: function(conversationId) {
				return Conversations.get({
					conversationId: conversationId
				}, function(conversation) {
					return conversation;
				}).$promise;
			},

			addOrUpdate: function(conversation) {

				if (!conversation._id) {

					return Conversations.save({}, conversation, function(data) {
						return data;
					}).$promise;

				} else {

					return Conversations.update({
						conversationId: conversation._id
					}, conversation, function(data) {
						return data;
					}).$promise;

				}
			}
		};

		return ConversationService;
	}
]);