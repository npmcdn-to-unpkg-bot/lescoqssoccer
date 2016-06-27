"use strict";

angular.module("mean.system").directive("cmLogin", ["$http", "$location", "$window", "Global", function($http, $location, $window, Global) {
	return {
		restrict: "E",
		transclude: true,
		templateUrl: "js/app/login.html",
		link: function($scope, element, attrs) {
			$scope.signup = false;
			// $scope.showSignup = function() {
			// 	$scope.signup = true;
			// };

			$scope.showSignin = function() {
				$scope.signup = false;
			};
		}
	}
}]);

angular.module("mean.system").directive("cmHeader", function() {
	return {
		restrict: "E",
		transclude: true,
		templateUrl: "js/app/header.html",
	}
});

angular.module("mean.system").directive("cmSidebar", function() {
	return {
		restrict: "E",
		controller: "SidebarController",
		templateUrl: "js/app/sidebar/sidebar.html",
		replace: true
	}
});

angular.module("mean.system").directive("cmIsotope", function() {
	return {
		restrict: "E",
		transclude: true,
		link: function($scope, element, attrs) {
			setTimeout(function() {
				var ux_pb = new ThemePageBuilder();
				ux_pb.init();
			});
		}
	}
});

angular.module("mean.system").directive("ngEnter", function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
});

angular.module("mean.system").directive("cmWysiwyg", function() {
	return {
		restrict: "E",
		transclude: true,
		link: function($scope, element, attrs) {
			setTimeout(function() {

				var config = {
					paste: {
						// Override default paste behavior, removing all inline styles
						style: "clean"
					},
					images: {
						upload: {
							url: '/upload/photo',
							basePath: '/'
						}
					}
				};

				var editor = textboxio.replace("#mytextarea", config);
				editor.content.set($scope.article.content);
			});
		}
	}
});

angular.module("mean.system").directive("cmTimeline", function() {
	return {
		restrict: "E",
		replace: true,
		link: function(scope, element, attrs) {
			if (scope.item.type === "standard") {
				scope.item.contentHTML = angular.element("<div>" + scope.item.content + "</div>").text();
			}

			attrs.$observe("type", function(postType) {
				scope.contentUrl = "js/home/views/timeline/" + postType + ".html";
			});
		},
		template: "<div ng-include='contentUrl'></div>"
	}
});

angular.module("mean.system").directive("cmProfileTimeline", function() {
	return {
		restrict: "E",
		replace: true,
		link: function(scope, element, attrs) {
			if (scope.item.type !== "comment" && scope.item.type !== "quote") {
				if (scope.item.type === "standard") {
					scope.item.contentHTML = angular.element("<div>" + scope.item.content + "</div>").text();
				}

				attrs.$observe("type", function(postType) {
					scope.contentUrl = "js/app/profile/views/timeline/" + postType + ".html";
				});
			}
		},
		template: "<div ng-include='contentUrl'></div>"
	}
});

angular.module("mean.system").directive("cmBlogPost", function() {
	return {
		restrict: "E",
		replace: true,
		link: function(scope, element, attrs) {
			var format = attrs.format;
			scope.contentUrl = "js/articles/views/" + format + "/" + attrs.type + ".html";
			attrs.$observe("type", function(postType) {
				scope.contentUrl = "js/articles/views/tiles/" + postType + ".html";
				if (scope.$last) {
					setTimeout(function() {
						var ux_pb = new ThemePageBuilder();
						ux_pb.init();

						$(".isotope-list-thumb").css("visibility", "visible");
					}, 200);
				}
			});
		},
		template: "<div ng-include='contentUrl'></div>"
	}
});

angular.module("mean.system").directive("cmComments", function() {
	return {
		restrict: "E",
		templateUrl: "js/app/comments/comments.html",
		scope: {
			updateMethod: "&",
			object: "="
		},
		controller: "CommentController"
	}
});

angular.module("mean.system").directive("cmConversations", function() {
	return {
		restrict: "E",
		transclude: true,
		templateUrl: "js/app/chat/chat.html",
		controller: "ChatController"
	}
});