angular.module('starter.controllers', [])

.controller('ProfileCtrl', function($scope,FacebookSrv,$state,$window,$q) {
	$scope.links = [];
        FacebookSrv.get('/me').then(
		function success(res){
			$scope.user = res.data;
            getUserMessages().then(function success(res){
                $scope.links = res;
            })
        },function error(err){
			$state.go('login');
		})

        $scope.goTo = function(uuid,messageId){
            $state.go('tab.message-detail',{"index":messageId,"uuid":uuid});
        }

        function getUserMessages(){
            var defer = $q.defer();
            var PostsObject = Parse.Object.extend("Posts");
            var query = new Parse.Query(PostsObject);
            query.equalTo("uuid",$window.localStorage.userId);
            query.find({
                success: function(results){
                    var links = [];
                    for (var j = 0; j < results.length; j++) {
                        if (results[j].attributes.isValid) {
                            links.push({"id": results[j].id, "messageId": results[j].attributes.messageId});
                        }
                    }
                    defer.resolve(links);

                },
                error : function(err){
                    alert("Error: " + error.code + " " + error.message);
                    defer.reject(err)
                }
            })
            return defer.promise;
        }
})

.controller('MessagesCtrl', function($scope, FacebookSrv,$state,$ionicLoading) {
  getData();
  function getData(){
  	$ionicLoading.show({
  		template: '<i class="icon ion-loading-c" style="font-size:40px;"></i><br/>Loading...'
  	})
  	FacebookSrv.get('/me/home').then(
  		function success(res){
  			$scope.items = res.data.data;
  			$ionicLoading.hide();
  			$scope.$broadcast('scroll.refreshComplete');
  		},function error(err){
            $ionicLoading.hide();
  			$state.go('login');
  		}
  	)
  }
  $scope.doRefresh = function(){
  	getData();
  }

})

.controller('MessagesDetailCtrl', function($scope, $stateParams, FacebookSrv) {
  var parms= {fields: 'id,message,type,icon,picture,comments{id,from,message,attachment,like_count}'};
        FacebookSrv.get('/'+$stateParams.index,parms).then(
            function success(res){
                $scope.value = res.data;
            },function error(err){
                $scope.message = "It seems the your message is removed";
                var PostsObject = Parse.Object.extend("Posts");
                var query = new Parse.Query(PostsObject);
                query.get($stateParams.uuid,{
                    success: function(response) {
                        response.set("isValid", false);
                        response.save();
                    },
                    error: function(object, error) {
                        alert("Error: " + error.code + " " + error.message);

                        // The object was not retrieved successfully.
                        // error is a Parse.Error with an error code and message.
                    }
                });

            })
        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };
})

.controller('LoginCtrl',  function($scope,FacebookSrv){
	$scope.login = function(){
		FacebookSrv.login();
	}
})

.controller('PostCtrl', function($scope,FacebookSrv,$state,$window) {
	$scope.post = function(){
		var parmas = {message:$scope.$$childTail.msg,
            privacy:{value:'FRIENDS_OF_FRIENDS'}};
		FacebookSrv.post("/me/feed",parmas).then(
			function success(res){
                var PostsObject = Parse.Object.extend("Posts");
                var postObject = new PostsObject();
                postObject.save({"uuid":$window.localStorage.userId,"messageId":res.data.id,"isValid":"true"});

                $state.go('tab.message-detail',{"index":res.data.id});
			},function error(err){
				$scope.response = err.data.error.message;
			})
	}
});
