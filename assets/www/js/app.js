angular.module('myapp', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/categories', {templateUrl: 'partials/category-list.html', controller: CategoryListCtrl})
      .when('/categories/:catId', {templateUrl: 'partials/product-list.html', controller: ProductListCtrl})
      .otherwise({redirectTo: '/categories'});
  }]);
