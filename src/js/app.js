'use strict';

angular.module('mean', ['ngCookies', 
						'ngResource', 
						'ngRoute', 
						'ui.bootstrap', 
						'ui.route', 
						'pascalprecht.translate', 
						'mean.system', 
						'mean.articles', 
						'mean.agenda', 
						'mean.users', 
						'mean.notifications', 
						'mean.suggestions']);

angular.module('mean.system', []);
angular.module('mean.articles', ['ui.bootstrap', 'angularFileUpload']);
angular.module('mean.agenda', ['ui.calendar', 'ui.bootstrap', 'google-maps']);
angular.module('mean.users', ['ui.bootstrap', 'angularFileUpload']);
angular.module('mean.notifications', []);
angular.module('mean.suggestions', []);
