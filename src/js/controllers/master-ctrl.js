/**
 * Master Controller
 */



angular.module('RDash')
  .controller('MasterCtrl', ['$scope', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $http) {
  /**
   * Sidebar Toggle & Cookie Control
   */
  var mobileView = 992;


  $scope.getWidth = function() {
    return window.innerWidth;
  };

  $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    if (newValue >= mobileView) {
      if (angular.isDefined($cookieStore.get('toggle'))) {
        $scope.toggle = !$cookieStore.get('toggle') ? false : true;
      } else {
        $scope.toggle = true;
      }
    } else {
      $scope.toggle = false;
    }

  });

  $scope.toggleSidebar = function() {

    var fs = require("fs");
    var text = fs.readFileSync("../a.txt").toString('utf-8');
    console.log(text);



    var audio = new Audio('http://localhost:4007/api/synthesize?voice=en-US_MichaelVoice&text=');
    audio.play();




    $scope.toggle = !$scope.toggle;
    $cookieStore.put('toggle', $scope.toggle);


  };



  window.onresize = function() {
    $scope.$apply();
  };
}
