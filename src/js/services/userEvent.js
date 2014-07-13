'use strict';

angular.module('mean.agenda').factory('UserEvent', ['$resource', function($resource) {
    return $resource('userEvent/:articleId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

