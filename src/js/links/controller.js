'use strict';

angular.module('mean.links').controller('LinkController', ['$scope', 'Global', '$window', 'LinksCollection', 'FileUploader',
	function($scope, Global, $window, LinksCollection, FileUploader) {

		$scope.global = Global;
		$scope.LinksCollection = LinksCollection;

		$scope.options = [{
			identifier: "clb-link",
			value: "Lien"
		}, {
			identifier: "clb-iframe",
			value: "Vidéo"
		}, {
			identifier: "clb-link",
			value: "Connerie"
		}];

		$scope.link = {
			title: "",
			image: "",
			author: "",
			adress: "",
			type: $scope.options[0].identifier
		};

		$scope.uploader = new FileUploader({
			scope: $scope,
			url: '/upload/photo',
			autoUpload: true,
			formData: [{
				key: 'value'
			}]
		});

		$scope.uploader.onCompleteItem = function(item, response, status, headers) {
			console.info('Complete', item, response);
			$scope.link.image = response.path;
		};

		$scope.links = [{
			author: "Jo",
			adress: "http://objectifjapon.wordpress.com",
			image: "img/jojo.jpg",
			title: "objectifjapon TKT",
			type: "links",
			cssclass: "clb-link"
		}, {
			author: "Nico et Amélie",
			adress: "http://www.youtube.com/embed/eh-0knDpn5g",
			image: "img/nico.jpg",
			title: "Deux noix au pays des kiwis",
			type: "videos",
			cssclass: "clb-iframe"
		}, {
			author: "Momo et Céline",
			adress: "http://bandedemickeysen4l.com/",
			image: "img/momo.jpeg",
			title: "Bande de Mickeys en 4L",
			type: "links",
			cssclass: "clb-link"
		}];

		$scope.add = function() {
			$scope.LinksCollection.add($scope.link, function() {
				$scope.content = "";
			});
		};

		$scope.getUselessSite = function(evt) {

			evt.preventDefault();
			evt.stopPropagation();

			$window.open(uselessSites[Math.round(Math.random() * uselessSites.length - 1)][0], "_blank");
		};

	}
]);

var uselessSites = [
	['http://heeeeeeeey.com/', false, 7],
	['http://thatsthefinger.com/', false, 7],
	['http://cant-not-tweet-this.com/', false, 7],
	['http://eelslap.com/', false, 5],
	['http://www.staggeringbeauty.com/', false, 7],
	['http://burymewithmymoney.com/', true, 7],
	['http://www.fallingfalling.com/', true, 3],
	['http://ducksarethebest.com/', false, 7],
	['http://www.trypap.com/', false, 4],
	['http://www.republiquedesmangues.fr/', false, 7],
	['http://www.movenowthinklater.com/', false, 6],
	['http://www.partridgegetslucky.com/', false, 6],
	['http://www.rrrgggbbb.com/', true, 7],
	['http://beesbeesbees.com/', false, 3],
	['http://www.sanger.dk/', true, 4],
	['http://www.koalastothemax.com/', false, 7],
	['http://www.everydayim.com/', false, 7],
	['http://www.leduchamp.com/', true, 7],
	['http://grandpanoclothes.com/', false, 6],
	['http://www.haneke.net/', false, 7],
	['http://r33b.net/', true, 6],
	['http://randomcolour.com/', false, 6],
	['http://cat-bounce.com/', true, 6],
	['http://cachemonet.com/', true, 6],
	['http://www.sadforjapan.com/', true, 5],
	['http://www.taghua.com/', true, 5],
	['http://chrismckenzie.com/', true, 6],
	['http://hasthelargehadroncolliderdestroyedtheworldyet.com/', false, 5],
	['http://ninjaflex.com/', false, 4],
	['http://iloveyoulikeafatladylovesapples.com/', true, 6],
	['http://ihasabucket.com/', false, 4],
	['http://corndogoncorndog.com/', false, 4],
	['http://giantbatfarts.com/', true, 4],
	['http://www.ringingtelephone.com/', true, 6],
	['http://www.pointerpointer.com/', false, 4],
	['http://www.pleasedonate.biz/', false, 5],
	['http://imaninja.com/', false, 3],
	['http://willthefuturebeaweso.me/', false, 3],
	['http://salmonofcapistrano.com/', false, 3],
	['http://www.ismycomputeron.com/', false, 5],
	['http://www.wwwdotcom.com/', false, 3],
	['http://www.nullingthevoid.com/', true, 6],
	['http://www.muchbetterthanthis.com/', true, 5],
	['http://www.ouaismaisbon.ch/', true, 3],
	['http://iamawesome.com/', false, 3],
	['http://www.pleaselike.com/', false, 7],
	['http://crouton.net/', false, 3],
	['http://corgiorgy.com/', false, 3],
	['http://www.electricboogiewoogie.com/', true, 6],
	['http://www.nelson-haha.com/', false, 6],
	['http://www.wutdafuk.com/', false, 6],
	['http://unicodesnowmanforyou.com/', false, 3],
	['http://tencents.info/', false, 3],
	['http://intotime.com/', true, 4],
	['http://leekspin.com/', true, 3],
	['http://minecraftstal.com/', false, 4],
	['http://www.riddlydiddly.com/', false, 5],
	['http://www.patience-is-a-virtue.org/', false, 2],
	['http://whitetrash.nl/', false, 2],
	['http://www.theendofreason.com/', false, 2],
	['http://zombo.com', true, 1],
	['http://secretsfornicotine.com/', true, 1],
	['http://pixelsfighting.com/', false, 1],
	['http://crapo.la/', false, 1],
	['http://baconsizzling.com/', false, 1],
	['http://isitwhite.com/', false, 1],
	['http://noot.space/', false, 1],
	['http://tomsdog.com/', false, 1],
	['http://hardcoreprawnlawn.com/', false, 1],
	['http://www.omfgdogs.com/', false, 7],
];