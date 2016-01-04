'use strict';

/**
 * @ngdoc function
 * @name magnificentDemo.controller:mainController
 * @description
 * # mainController
 * Controller of the magnificentDemo
 */
angular.module('magnificentDemo')
.controller('mainController', ['$rootScope', '$scope', function ($rootScope, $scope) {

	// You can call your model whatever you want, just remember to specify the 'magnificent' attribute on your directive
	$scope.magnificent = {
		current: 0,	// Actual slide, the starup slide as well, use it to change the current slide to another (the 0 based index of slides' array)
	  	slides: [
	  		{
		  		src: 'http://www.ambwallpapers.com/wp-content/uploads/2015/04/autumn-sunset-hd-wallpaper-nature-landscape-images-autumn-wallpaper1-AMB1.jpg',
	  			title: "Example slide title",
	  			description: "Somewhere in the world...",
	  			author: "Example author",
	  			copyright: "copyright (c) owner 2015",
	  			url: "#"
		  	},
	  		{
	  			// Only src is required, the meta-data is reserved for future implementations
		  		src: 'http://www.download-free-wallpaper.com/img39/rtiqsmtsckpbfafhtlnj.jpg',
	  			title: "Example slide title",
	  			description: "Somewhere in the world...",
	  			author: "Example author",
	  			copyright: "copyright (c) owner 2015",
	  			url: "#"
		  	},
		  	{
		  		src: 'http://hdwallpaperspretty.com/wp-content/gallery/wallpaper-nature-new/nature-spring-season-fresh-new-hd-wallpaper-randy-s_Nature-Spring-season-Fresh-New-Hd-Wallpaper-.jpg',
	  			title: "Example slide title",
	  			description: "Somewhere in the world...",
	  			author: "Example author",
	  			copyright: "copyright (c) owner 2015",
	  			url: "#"
		  	}
  		],
	  	settings: {
	  		enabled: true,	// Controls if the slider is enabled (true: play, false: stop)
	        interval: 10,	// Interval in seconds between each image
	  	}
	  	//mouseMove: function(e){}	// Optional event: if enabled, fires whenever the mouse is moved inside the page body
  	};
}]);