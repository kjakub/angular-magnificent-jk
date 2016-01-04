/*
 * angular-magnificent
 * https://github.com/pixeleur/angular-magnificent
 *
 * Copyright (c) 2016 Manuel Ramirez - Pixeleur
 * Licensed under the MIT license.
 */

if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'angular-magnificent';
}
(function ( angular ) {
    'use strict';
    
    var angularMagnificent = angular.module( 'angular-magnificent', [] );
    angularMagnificent.constant('defaults', {
        enabled: true,
        interval: 30,
        current: 0,
        mouseMove: null
    });
    angularMagnificent.directive('magnificent', ['$window', '$timeout', '$interval', function($window, $timeout, $interval) {
        return {
            restrict: 'E',
            transclude: true,
            template:   '<ul class="magnificent-slider">' +
                            '<li ng-repeat="slide in magnificent.slides track by $index">' +
                                '<img ng-src="{{slide.src}}" id="slide{{$index}}"  class="magnificent-loading magnificent-fadein magnificent-fadeout" ng-show="magnificent.current==$index" preload/>' +
                            '</li>' +
                        '</ul>',
            scope: {
                magnificent: "="
            },
            controller: ['$scope', 'defaults', function($scope, defaults) {
                
                // Load defaults for undefined settings
                angular.extend(defaults,$scope.magnificent.settings);
                $scope.magnificent.settings = defaults;
                $scope.interval = $scope.magnificent.settings.interval * 1000;  // Convert seconds to miliseconds
            }],
            link: function ($scope, element, attrs){

                // If defined, bind mouseMove event to body
                if(typeof $scope.magnificent.mouseMove !== 'undefined'){
                    angular.element(document.body).bind('mousemove', function(e){
                        $scope.magnificent.mouseMove(e);
                    });
                }

                // Bind resize event to window
                angular.element($window).bind('resize', function(){
                    $scope.resize();
                });

                // Watch current slide updates and call resize
                $scope.$watch('magnificent.current', function(){
                    // Call resize
                    $timeout(function(){
                        $scope.resize();
                    }, 0);
                });

                // Resize Images
                $scope.resize = function resize(){
                    
                    // Get viewport dimensions
                    var vpWidth = $window.innerWidth;
                    var vpHeight = $window.innerHeight;

                    // Get img's native handle
                    var ielmNative = document.getElementById('slide' + $scope.magnificent.current);
                    var iElmParent = angular.element(ielmNative.parentNode);

                    // Get img's angular handle
                    var iElm = iElmParent.find("img");

                    // Get img's original dimensions
                    var imgWidth = ielmNative.naturalWidth;
                    var imgHeight = ielmNative.naturalHeight;

                    /* If natural dimesions are not available, resize to viewport.
                       This prevents white spaces during initialization */
                    if(imgWidth === 0 && imgHeight === 0){
                        imgWidth = vpWidth;
                        imgHeight = vpHeight;
                    }

                    // Get the size (keeping aspect ratio) that fills the viewport entirely
                    var fitCss = $scope.getFitCss(vpWidth, vpHeight, imgWidth, imgHeight);

                    // Apply dimensions and center position the image
                    iElm.css({width: fitCss.width + 'px', height: fitCss.height + 'px'});
                    iElm.css('left', ((vpWidth / 2) - (fitCss.width / 2)) + 'px');
                    iElm.css('top', ((vpHeight / 2) - (fitCss.height / 2)) + 'px');

                };

                /* Get the largest/smallest image dimensions it takes to 
                   coveri the viewport while still keeping aspect iamge's aspect ratio */
                $scope.getFitCss = function getFitCss(vpWidth, vpHeight, imgWidth, imgHeight) {

                    var imgFinalDim;

                    // Process according to ratios relationship
                    if((imgWidth > vpWidth) && (imgHeight > vpHeight)){         // If image is taller and wider than viewport
                        imgFinalDim = $scope.reduce(imgWidth, imgHeight, vpWidth, vpHeight);
                    } else if((imgWidth < vpWidth) && (imgHeight < vpHeight)){  // If viewport is taller and wider than image
                        imgFinalDim = $scope.increase(imgWidth, imgHeight, vpWidth, vpHeight);
                    } else if((imgWidth > vpWidth) && (imgHeight < vpHeight)){  // If image is wider but not taller than viewport
                        imgFinalDim = $scope.increaseH(imgWidth, imgHeight, vpHeight);
                    } else if((imgWidth < vpWidth) && (imgHeight > vpHeight)){  // If image is taller but not wider than viewport
                        imgFinalDim = $scope.increaseW(imgWidth, imgHeight, vpWidth);
                    } else if((imgWidth === vpWidth) && (imgHeight === vpHeight)){// If image and viewport are the same size (1 in 1000000!)
                        imgFinalDim = {W: vpWidth, H: vpHeight};
                    }

                    return {width: imgFinalDim.W, height: imgFinalDim.H};
                };

                // Reduce two numbers until any of them reaches it's limit
                $scope.reduce = function reduce(reduceW, reduceH, limitW, limitH) {

                    var stop = false;

                    while(!stop){
                        reduceW--;
                        reduceH--;

                        if(reduceW === limitW){
                            stop = true;
                        }

                        if(reduceH === limitH){
                            stop = true;
                        }
                    }

                    return {W: reduceW, H: reduceH};
                };

                // Reduce two numbers until one of them reaches it's limit
                $scope.reduceW = function reduceW(reduceW, reduceH, limitW) {

                    var stop = false;

                    while(!stop){
                        reduceW--;
                        reduceH--;
                        stop = (reduceW === limitW)? true:false;
                    }

                    return {W: reduceW, H: reduceH};
                };

                // Reduce two numbers until one of them reaches it's limit
                $scope.reduceH = function reduceH(reduceW, reduceH, limitH) {

                    var stop = false;

                    while(!stop){
                        reduceW--;
                        reduceH--;
                        stop = (reduceW === limitH)? true:false;
                    }

                    return {W: reduceW, H: reduceH};
                };

                // Increase two numbers until any of them reaches it's limit
                $scope.increase = function increase(increaseW, increaseH, limitW, limitH) {

                    var stop = false;

                    while(!stop){
                        increaseW++;
                        increaseH++;

                        if((increaseW >= limitW) && (increaseH >= limitH)){
                            stop = true;
                        }
                    }

                    return {W: increaseW, H: increaseH};
                };

                // Increase two numbers until one of them reaches it's limit
                $scope.increaseW = function increaseW(increaseW, increaseH, limitW) {

                    var stop = false;

                    while(!stop){
                        increaseW++;
                        increaseH++;
                        stop = (increaseW === limitW)? true:false;
                    }

                    return {W: increaseW, H: increaseH};
                };

                // Increase two numbers until one of them reaches it's limit
                $scope.increaseH = function increaseH(increaseW, increaseH, limitH) {

                    var stop = false;

                    while(!stop){
                        increaseW++;
                        increaseH++;
                        stop = (increaseH === limitH)? true:false;
                    }

                    return {W: increaseW, H: increaseH};
                };

                // Check if element has the specified class
                $scope.hasClass = function hasClass(elm, cls){
                    $timeout(function () {
                        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
                    });
                };

                // Slider loop
                $interval(function(){

                    // Get img's native handle
                    var ielmNative = document.getElementById('slide' + $scope.magnificent.current);

                    // If not enabled or image isn't loaded yet, skip
                    if(!$scope.magnificent.settings.enabled || $scope.hasClass(ielmNative, 'magnificent-loading')){
                        return;
                    }

                    // Endless loop thru slides
                    if($scope.magnificent.current === $scope.magnificent.slides.length -1){
                        $scope.magnificent.current = 0;
                    } else{
                        $scope.magnificent.current++;
                    }
                }, $scope.interval, 0);

                // Get the path of this js file
                $scope.getPath = function getPath(){
                    var scripts = document.getElementsByTagName('script');
                    var scriptName = 'angular-magnificent.min.js';
                    var script, beacon, index;
                    // Traverse script tags to find our script
                    angular.forEach(scripts, function(value, key){
                        script = value;
                        beacon = script.src.substring((script.src.length) - (scriptName.length));

                        if(beacon === scriptName){
                            index = key;
                        };
                    });

                    script = scripts[index];
                    var scriptPath = script.src;

                    // Replace the source url
                    return scriptPath.replace(scriptName, 'angular-magnificent.min.css');
                };

                // Sometimes the css is not linked, do it if this is the case
                $scope.linkStyle = function linkStyle(){
                    var stylePath = $scope.getPath();
                    var styleLinked = false;
                    var head = document.getElementsByTagName('head')[0];

                    // look fot the slyle link
                    angular.forEach(head.childNodes, function(value, key){
                        if(value.src === stylePath){
                            styleLinked = true;     // Style has been linked properly
                        }
                    });

                    // Link style if not linked
                    if(!styleLinked){
                        var link = document.createElement('link');
                        link.type = 'text/css';
                        link.rel = 'stylesheet';
                        link.href = stylePath;
                        head.appendChild(link);
                    }
                };

                // Link style (bug #001)
                $scope.linkStyle();
            }
        };
    }]);
    angularMagnificent.factory('loader', function(){
        return function (url, success, error) {
            // Bind the load event to the image
            angular.element(new Image()).bind('load', function(){
                success();      // When image has finished loading
            }).bind('error', function(){
                error();        // If image load failed
            }).attr('src', url);
        };
    });
    angularMagnificent.directive('preload', ['loader', function(loader){
        return {
            restrict: 'A',
            scope: true,
            link: function($scope, elem, attrs) {
                $scope.url = attrs.ngSrc;
                loader($scope.url, function(){
                    attrs.$set('src', $scope.url);              // Set img src attribute
                    elem.removeClass('magnificent-loading');    // Remove loading class
                    elem.addClass('magnificent-slide');         // Add slide class
                }, function(){
                    console.log("failed");
                });
            }
        };
    }]);
})(angular);