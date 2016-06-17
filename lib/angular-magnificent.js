/*
 * angular-magnificent
 * https://github.com/pixeleur/angular-magnificent
 *
 * Copyright (c) 2016 Manuel Ramirez - Pixeleur
 * Licensed under the MIT license.
 * Forked JK
 */

if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'angular-magnificent';
}
(function ( angular ) {
    'use strict';
    
    var angularMagnificent = angular.module( 'angular-magnificent', [] );
    angularMagnificent.constant('defaults', {
        enabled: true,
        interval: 5,
        current: 0,
        mouseMove: null
    });
    angularMagnificent.directive('magnificent', ['$window', '$timeout', '$interval', function($window, $timeout, $interval) {

        var template = '<ul class="magnificent-slider">' +
                            '<li ng-repeat="slide in magnificent.slides track by $index">' +
                                '<div slide-src="{{slide.src}}" picture-id="{{slide.id}}" id="slide{{$index}}"  class="magnificent-loading magnificent-fadein magnificent-fadeout" ng-show="magnificent.current==$index" preload></div>' +
                            '</li>' +
                        '</ul>'

        return {
            restrict: 'E',
            // transclude: true,
            template: template,
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
                    $timeout(function(){
                    }, 0);
                });

                // Watch current slide updates and call resize
                // $scope.$watch('magnificent.current', function(){
                //     // Call resize
                //     $timeout(function(){
                //     }, 0);
                // });

                // Check if element has the specified class
                var hasClass = function(elm, cls){
                  $timeout(function () {
                    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
                  })
                };

                var getLastSeenIdFromIndex = function(index){
                  var currentElement = document.getElementById('slide' + index);
                  return currentElement.getAttribute('picture-id');
                };

                // Slider loop
                var promise = $interval(function(){
                    

                    // Get img's native handle
                    var ielmNative = document.getElementById('slide' + $scope.magnificent.current);

                    // If not enabled or image isn't loaded yet, skip
                    if(!$scope.magnificent.settings.enabled || hasClass(ielmNative, 'magnificent-loading')){
                        console.log('still not ready');
                        return;
                    }

                    // Endless loop thru slides if there is any
                    if($scope.magnificent.slides.length > 0){
                      if($scope.magnificent.current === $scope.magnificent.slides.length -1){
                        $scope.magnificent.slideUpdate(getLastSeenIdFromIndex($scope.magnificent.current), true, false);
                        $scope.magnificent.current = 0;
                      }else{
                        $scope.magnificent.slideUpdate(getLastSeenIdFromIndex($scope.magnificent.current), false, false);
                        $scope.magnificent.current++;
                      }
                    }else{
                      $scope.magnificent.slideUpdate(null, null, true);
                    }



                }, $scope.interval, 0);

                element.on('$destroy', function(){
                  $interval.cancel(promise);
                });

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
            return angular.element(new Image())
              .bind('load', function(){
                success();      // When image has finished loading
              })
              .bind('error', function(){
                error();        // If image load failed
            }).attr('src', url);
        };
    });
    angularMagnificent.directive('preload', ['loader', function(loader){
        return {
            restrict: 'A',
            scope: true,
            link: function($scope, elem, attrs) {
                var url = attrs.slideSrc;
  

                 attrs.$observe('slideSrc', function(url) {
                    elem.addClass('magnificent-loading'); 
                    elem.removeClass('magnificent-slide');
                    var img = loader(url, function(){
                        elem.css({
                            'background-image': 'url(' + url +')'
                        });
                        elem.removeClass('magnificent-loading');    // Remove loading class
                        elem.addClass('magnificent-slide');         // Add slide class
                    }, function(){
                        console.log("failed");
                    });

                 });





            }
        };
    }]);
})(angular);