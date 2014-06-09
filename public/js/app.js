'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.articles', 'mean.graph', 'mean.agenda', 'mean.team']);

angular.module('mean.system', []);
angular.module('mean.articles', ['ui.bootstrap', 'angularFileUpload']);
angular.module('mean.graph', ['angularCharts']);
angular.module('mean.agenda', ['ui.calendar', 'ui.bootstrap', 'google-maps']);
angular.module('mean.team', []);