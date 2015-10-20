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
			}
		}

		return ConversationService;
	}
]);