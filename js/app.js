// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,FacebookSrv,$state,$window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  FacebookSrv.init("336381943208242");
  Parse.initialize("ZyJuqvjTm2rsyFv6AHXRUmowlUPMlH3ZHOQbt27o", "5qK0TQj45X4gh8Q5drjhIAiPTYRndFK8XWmv6YuY");

  if(FacebookSrv.oauthCallback($window.location.href)) {
          $state.go('tab.friends');
  }
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'templates/tab-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('tab.messages', {
      url: '/messages',
      views: {
        'tab-messages': {
          templateUrl: 'templates/tab-messages.html',
          controller: 'MessagesCtrl'
        }
      }
    })
    .state('tab.message-detail', {
      url: '/messages/:index/:uuid',
      views: {
        'tab-messages': {
          templateUrl: 'templates/message-detail.html',
          controller: 'MessagesDetailCtrl'
        }
      }
    })
    .state('tab.list-message-detail', {
          url: '/messages/:index',
          views: {
              'tab-messages': {
                  templateUrl: 'templates/message-detail.html',
                  controller: 'MessagesDetailCtrl'
              }
          }
    })
    .state('login',{
      url:'/login',
      templateUrl:'/templates/login.html',
      controller:'LoginCtrl'
    })


    .state('tab.post', {
          url: '/post',
          views: {
              'tab-post': {
                  templateUrl: 'templates/tab-post.html',
                  controller: 'PostCtrl'
              }
          }
      });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/messages');

});

