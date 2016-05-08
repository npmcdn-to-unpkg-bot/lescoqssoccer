'use strict';

angular.module('mean', ['ngCookies',
	'ngResource',
	'ngRoute',
	'ui.bootstrap',
	'ui.route',
	'pascalprecht.translate',
	'mean.system',
	'mean.home',
	'mean.articles',
	'mean.agenda',
	'mean.users',
	'mean.suggestions',
	'mean.albums'
]);

angular.module('mean.system', []);
angular.module('mean.home', []);
angular.module('mean.articles', ['ui.bootstrap', 'angularFileUpload']);
angular.module('mean.agenda', ['mwl.calendar', 'ui.bootstrap', 'google-maps','angularFileUpload']);
angular.module('mean.users', ['ui.bootstrap', 'angularFileUpload']);
angular.module('mean.suggestions', []);
angular.module('mean.albums', ['ui.sortable', 'ui.bootstrap','angularFileUpload']);