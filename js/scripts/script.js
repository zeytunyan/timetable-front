let module = angular.module("clientApp");

// Controller
module.controller("clientCtrl", function ($scope, $http) {
    // Navigation bar items
    $scope.menu = ['Timetable', 'Groups', 'Teachers', 'Classrooms'];
    // Loading flag
    $scope.loading = false;
    // Initially, we are on the home page
    $scope.place = 'Home';
    
    // A function to execute when the user clicks on the navigation bar button
    $scope.changePlace = (place) => {
        $scope.place = place;
        $scope.table = [];
        $scope.loading = false;
        // If the "Home" button is clicked, nothing more happens
        if (place === 'Home') return;
        
        // If not, data is requested from the server
        $scope.loading = true;
        
        $http({ 
          method: 'GET', 
          url: `http://127.0.0.1:1337/${place.toLowerCase()}` 
        }).then(res => {
            const resXml = (new DOMParser()).parseFromString(res.data, "text/xml");
            // If the correct xml is received, it is displayed on the page
            if (resXml && resXml.documentElement && resXml.documentElement.nodeName != 'parsererror') {
                $scope.loading = false;
                $scope.table = xmlToArray(resXml);
            }
        });
    }
});

// A filter that turns xml tags into normal words
module.filter('xmlTagFilter', () => {
    return text => {
        const index = text.indexOf('_');
        if (index !== -1) {
            const firstPart = text.slice(0, index);
            const seondPart = text.slice(index + 1);
            text = firstPart + ' ' + (seondPart === 'num' ? 'number' : seondPart);
        }
        return text[0].toUpperCase() + text.slice(1);
    }
});

// A function that converts xml to an array that is convenient for output
function xmlToArray(xml) {
  let array = [];
  for (let childNode of xml.documentElement.childNodes) {
      if (childNode.nodeType != 1) continue;
      let goodChilds = [];
      
      for (let child of childNode.childNodes) {
          if (child.nodeType != 1) continue;
          goodChilds.push(child);
      }
      array.push(goodChilds);
  }
  return array;
}
