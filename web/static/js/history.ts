interface IHistoryScope extends IBosunScope {
	ak: string;
	alert_history: any;
	error: string;
	shown: any;
	collapse: (i: any) => void;
}

bosunControllers.controller('HistoryCtrl', ['$scope', '$http', '$location', '$route', function($scope: IHistoryScope, $http: ng.IHttpService, $location: ng.ILocationService, $route: ng.route.IRouteService) {
	var search = $location.search();
	var keys: any = {};
	if (angular.isArray(search.key)) {
		angular.forEach(search.key, function(v) {
			keys[v] = true;
		});
	} else {
		keys[search.key] = true;
	}
	var status: any;
	$scope.shown = {};
	$scope.collapse = (i: any) => {
		$scope.shown[i] = !$scope.shown[i];
	};
	var selected_alerts: any[] = [];
	function done() {
		var status = $scope.schedule.Status;
		angular.forEach(status, function(v, ak) {
			if (!keys[ak]) {
				return;
			}
			angular.forEach(v.History, function(h: any, i: number) {
				if (i + 1 < v.History.length) {
					h.EndTime = v.History[i + 1].Time;
				} else {
					h.EndTime = moment.utc();
				}
			});
			v.History.reverse();
			selected_alerts.push({
				Name: ak,
				History: v.History,
			});
		});
		if (selected_alerts.length > 0) {
			$scope.alert_history = selected_alerts;
		} else {
			$scope.error = 'No Matching Alerts Found';
		}
	}
	if ($scope.schedule) {
		done();
	} else {
		$scope.refresh()
			.success(done);
	}
}]);
