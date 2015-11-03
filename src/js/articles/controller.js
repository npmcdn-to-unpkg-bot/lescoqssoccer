'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', 'Global', '$location', '$sce', '$modal', 'ArticlesCollection', 'Articles', 'Page', 'ItemsCount',
	function($scope, Global, $location, $sce, $modal, ArticlesCollection, Articles, Page, ItemsCount) {

		$scope.global = Global;
		$scope.articles = Articles;

		$scope.page = parseInt(Page);
		$scope.totalItems = ItemsCount.count;
		$scope.itemsPerPage = ArticlesCollection.itemsPerPage;

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return $sce.trustAsHtml(html);
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		//Manage pagination
		$scope.pageChanged = function(newPage) {
			$location.path((newPage === 1) ? "/articles" : "/articles/" + newPage);
		};

		$scope.openCreateView = function(articleType) {
			window.location = "#!/articles/create/" + articleType;
		};

		$scope.closeModal = function() {
			$scope.modalInstance.close();
		};

		$scope.isSpotify = function(link){
			console.warn(link);
			return link.indexOf('spotify') !== -1;
		};
	}
]);

angular.module('mean.articles').controller('ArticleDetailController', ['$scope', '$location', '$sce', '$modal', 'Global', 'ArticlesCollection', 'Article',
	function($scope, $location, $sce, $modal, Global, ArticlesCollection, Article) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;
		$scope.dateFormat = "dd MMMM yyyy";

		//Format html content from article content edit by wysiwyg
		$scope.getFormattedContent = function(html) {
			return $sce.trustAsHtml(html);
		};

		//Format video and audio url
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

		$scope.showAnswerForm = function(evt, comment) {

			evt.preventDefault();
			evt.stopPropagation();

			var id = comment._id;
			$scope.reply = comment;

			$(".reply-cancel").hide();
			$(".reply:not(.reply-cancel)").show();

			$("#" + id + '-reply').hide();
			var elt = $("#" + id + "-reply-cancel");

			elt.show();
			$('#formAnswer').show().insertAfter(elt);
		};

		$scope.hideAnswerForm = function(evt) {

			if(evt){
				evt.preventDefault();
				evt.stopPropagation();
			}

			$scope.reply = "";
			$(".reply-cancel").hide();
			$('#formAnswer').hide();
			$(".reply:not(.reply-cancel)").show();
		};

		$scope.addComment = function() {

			if ($scope.comment !== "") {

				$scope.article.comments.push({
					user: $scope.global.user._id,
					content: $scope.comment,
					created: moment(new Date()).toISOString()
				});

				$scope.ArticlesCollection.update($scope.article).then(function() {
					$scope.comment = "";
				});
			}

		};

		$scope.addReply = function() {

			if ($scope.replyText !== "") {

				$scope.reply.replies.push({
					user: $scope.global.user._id,
					content: $scope.replyText,
					created: moment(new Date()).toISOString()
				});

				$scope.ArticlesCollection.update($scope.article).then(function() {
					$scope.hideAnswerForm();
				});
			}

		};

		$scope.edit = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$location.path("/articles/edit/" + $scope.article.type + "/" + $scope.article._id);
		};

		$scope.remove = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			var modalInstance = $modal.open({
				templateUrl: 'js/articles/views/modal/deleteArticleModal.html',
				controller: 'deleteArticleModalCtrl',
				resolve: {
					article: function() {
						return $scope.article;
					}
				}
			});

			modalInstance.result.then(function() {

				// Delete the article and redirect to article list
				$scope.ArticlesCollection.remove($scope.article).then(function(response) {
					$location.path("/articles");
				});

			});
		};

		$scope.backToList = function() {
			$location.path("/articles").replace();
		};

		$scope.showPrevious = function() {
			var previous = $scope.ArticlesCollection.getPrevious($scope.article);
			$location.path("/articles/view/" + previous.type + "/" + previous._id).replace();
		};

		$scope.showNext = function() {
			var next = $scope.ArticlesCollection.getNext($scope.article);
			$location.path("/articles/view/" + next.type + "/" + next._id).replace();
		};
	}
]);

angular.module('mean.articles').controller('CreateArticleController', ['$scope', '$location', 'Global', 'ArticlesCollection', 'FileUploader', 'Article',
	function($scope, $location, Global, ArticlesCollection, FileUploader, Article) {

		$scope.global = Global;
		$scope.ArticlesCollection = ArticlesCollection;
		$scope.article = Article;

		switch ($scope.article.type) {
			case "link":
				$scope.title = "Nouveau lien";
				break;
			case "video":
				$scope.title = "Nouvelle vidéo";
				break;
			case "audio":
				$scope.title = "Nouveau son";
				break;
		};

		/***
		CATEGORIES
		***/
		$scope.categories = [{
			id: "1",
			value: "Voluptate"
		}, {
			id: "2",
			value: "Deserani"
		}, {
			id: "3",
			value: "Quo eram"
		}, {
			id: "4",
			value: "Mentitum amet sit"
		}, {
			id: "5",
			value: "Cillum"
		}, {
			id: "6",
			value: "Incurreret"
		}, {
			id: "7",
			value: "Eram amet aliqua"
		}];

		$scope.toggleCategory = function(category, evt) {

			evt.preventDefault();
			evt.stopPropagation();

			if ($scope.article.categories.indexOf(category) === -1) {
				$scope.article.categories.push(category);
			} else {
				$scope.article.categories.splice($scope.article.categories.indexOf(category), 1);
			}

		};

		$scope.isActive = function(category) {
			var categoryId = category.id;
			return _.filter($scope.article.categories, function(_category) {
				return _category.id === categoryId;
			}).length > 0;
		};

		/***
		FILE UPLOAD CONFIG
		***/
		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			$scope.article.image = response.path;
		};

		$scope.create = function() {

			switch ($scope.article.type) {
				case "link":
					$scope.article.linkAdress = [{
						value: "Nouveau lien",
						adress: $scope.linkAdress
					}];
					break;
				case "video":
					$scope.article.videoLink = $scope.linkAdress;
					break;
				case "audio":
					$scope.article.audioLink = $scope.linkAdress;
					break;
				case "standard":
					$scope.article.content = textboxio.get('#mytextarea')[0].content.get();
					break;
			}

			if (!$scope.article._id) {

				$scope.ArticlesCollection.add($scope.article).then(function(response) {
					$location.path("/articles");
				});

			} else {

				$scope.ArticlesCollection.update($scope.article).then(function() {
					$location.path("/articles");
				});

			}
		};
	}
]);

angular.module('mean.articles').controller('deleteArticleModalCtrl', ['$scope', '$modalInstance', 'article',

	function($scope, $modalInstance, article) {

		$scope.article = article;

		$scope.ok = function(result) {
			$modalInstance.close(result);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}

]);

var ArticlesData = {

	Articles: function(ArticlesCollection, $route) {
		var page = $route.current.params.page || 1;
		return ArticlesCollection.load(page);
	},
	Page: function($route) {
		return $route.current.params.page || 1;
	},
	ItemsCount: function(ArticlesCollection) {
		return ArticlesCollection.getItemsCount();
	}

};

var ArticleDetailData = {

	Article: function(ArticlesCollection, $route, $location) {
		return ($route.current.params.id) ? ArticlesCollection.findOne($route.current.params.id) : {
			type: $location.path().split("/").pop(),
			categories: [],
			content: ""
		};
	},

	Articles: function(ArticlesCollection, $route) {
		var page = $route.current.params.page || 1;
		return ArticlesCollection.load(page);
	},

};