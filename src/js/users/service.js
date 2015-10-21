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

			load: function() {
				return Conversations.query({}, function(conversations) {
					ConversationService.all = conversations;
					return conversations;
				}).$promise;
			},

			getConversation: function(user1, user2) {

				var conversation = _.filter(ConversationService.all, function(conversation) {
					return _.contains(conversation.users, user1) && _.contains(conversation.users, user2);
				});

				if (conversation.length === 1) {
					return conversation[0];
				} else {
					return {
						users: [user1, user2],
						messages: []
					};
				}
			},

			findOne: function(conversationId) {
				return Conversations.get({
					conversationId: conversationId
				}, function(conversation) {
					return conversation;
				}).$promise;
			},

			add: function(conversation) {
				return Conversations.save({}, conversation, function(data) {
					return data;
				}).$promise;
			},

			update: function(conversation) {
				return Conversations.update({
					conversationId: conversation._id
				}, conversation, function(data) {
					return data;
				}).$promise;
			}
		}

		return ConversationService;
	}
]);