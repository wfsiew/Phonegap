function CategoryListCtrl($scope, $http) {
  $http.get('categories/categories.json').success(function(data) {
    $scope.categories = data;
    $scope.orderProp = 'name';
  });
}

function ProductListCtrl($scope, $routeParams, $http, $filter) {
  $scope.fileSystem;
	
  $http.get('categories/products.' + $routeParams.catId + '.json').success(function(data) {
    $scope.products = data;
    $scope.catId = $routeParams.catId;
  });
  
  $scope.selected = function() {
    return $filter('filter')($scope.products, {selected: true});
  }
  
  $scope.exportFile = function() {
    $scope.writeFile();
  }
  
  $scope.disable = function() {
    var list = $scope.selected();
    if (list == null)
      return true;
      
    return list.length > 0 ? false : true;
  }
  
  $scope.init = function() {
    document.addEventListener("deviceready", $scope.onDeviceReady, true);
  }
  
  $scope.onDeviceReady = function() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $scope.onGetFSSuccess, $scope.fail);
  }
  
  $scope.onGetFSSuccess = function(fileSystem) {
	$scope.fileSystem = fileSystem;
  }
  
  $scope.fail = function(error) {
	alert('Error: ' + error.toString());
  }
  
  $scope.writeFile = function() {
    $scope.fileSystem.root.getFile('export.xml', {create: true}, $scope.beginWrite, $scope.fail);
  }
  
  $scope.beginWrite = function(f) {
	f.createWriter(function(w) {
	  w.onwrite = function() {
		$scope.showMessage('Export complete');
	  }
	  
	  var list = $scope.selected();
	  var n = list.length;
	  var i;
	  var s = [];
	  w.seek(0);
	  s.push('<?xml version="1.0" encoding="utf-8"?>' + "\n");
	  s.push("<products>\n");
	  
	  for (i = 0; i < n; i++) {
		s.push("\t<product>\n");
		s.push("\t\t<code>" + list[i].code + "</code>\n");
		s.push("\t\t<name>" + list[i].name + "</name>\n");
		s.push("\t\t<price>" + list[i].price + "</price>\n");
		s.push("\t</product>\n");
	  }
	  
	  s.push("</products>");
	  var v = s.join('');
	  w.write(v);
	});
  }
  
  $scope.showMessage = function(a) {
	navigator.notification.alert(
	  a,
	  $scope.alertDismissed,
	  'Export',
	  'Done'
    );
  }
  
  $scope.alertDismissed = function() {
	  
  }
  
  $scope.init();
}

function DirListCtrl($scope, $http) {

	$scope.init = function() {
		document.addEventListener("deviceready", $scope.onDeviceReady, true);
	}
	
	$scope.success = function(entries) {
		var i;
		var n = entries.length;
		$scope.dirs = [];
		for (i = 0; i < n; i++) {
			if (entries[i].isFile == false)
			  $scope.dirs.push(entries[i]);
		}
		
		$scope.orderProp = 'name';
		$scope.$apply();
	}
	
	$scope.fail = function(error) {
		alert(evt.target.error.code);
	}
	
	$scope.onSuccess = function(fileSystem) {
		$scope.name = fileSystem.name;
		$scope.rootname = fileSystem.root.name;
		
		var dirReader = fileSystem.root.createReader();
		dirReader.readEntries($scope.success, $scope.fail);
	}
	
	$scope.onDeviceReady = function() {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $scope.onSuccess, $scope.fail);
	}
	
	//$scope.init();
}