(function() {
  /*
   * decaffeinate suggestions:
   * DS102: Remove unnecessary code created because of implicit returns
   * DS207: Consider shorter variations of null checks
   * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
   */
  const app = angular.module("app");

  app.controller("WorklogsController", [
    "$scope", "$q", "Worklog", "Client", "User", function($scope, $q, Worklog, Client, User) {
      $scope.init = function() {
        $scope.hstep = 1;
        $scope.mstep = 10;
        $scope.clients = [];
        $scope.currentUser = null;
        $scope.dateOptions = {
          formatYear: "yy",
          startingDay: 1,
          maxDate: new Date(), // today
        };
        const idPresent = (typeof gon !== 'undefined' && gon !== null) && gon && gon.worklog_id;

        // Only fetch worklog if it is present
        const query = _.select([
          Client.query({}),
          User.get(gon.current_user_id),
          idPresent ? Worklog.get(gon.worklog_id) : null
        ], e => e);

        return $q.all(query).then(function(results) {
          $scope.clients = results[0];
          $scope.currentUser = results[1];

          if (idPresent) {
            $scope.worklog = results[2];
          } else {
            $scope.worklog = new Worklog;
          }

          // All loaded, start watching.
          $scope.$watch("worklog.client", function(newValue, oldValue) {
            const t = $scope.worklog.calcTotal();
            return $scope.worklog.total = t;
          });
          $scope.$watch("worklog.hourlyRate", function(newValue, oldValue) {
            const t = $scope.worklog.calcTotal();
            return $scope.worklog.total = t;
          });
          $scope.$watch("worklog.timeframes", function(newValue, oldValue) {
              const t = $scope.worklog.calcTotal();
              const duration = $scope.worklog.calcTotalDuration();
              $scope.worklog.total = t;
              return $scope.worklog.totalDuration = moment.duration(duration, 'seconds');
            }
            , true);

          if (gon.client_id) {
            const getSelectedClient = () => _.select($scope.clients,
              c => c.id === gon.client_id)[0];
            return $scope.worklog.client = getSelectedClient();
          }
        });
      };

      $scope.open = function($event, timeframe) {
        $event.preventDefault();
        $event.stopPropagation();
        return timeframe.opened = true;
      };

      $scope.openEnded = function($event, timeframe) {
        $event.preventDefault();
        $event.stopPropagation();
        return timeframe.openedEnded = true;
      };

      $scope.sliderOptions = {
        floor: 0,
        ceil: 24 * 60 * 60 * 1000 - 1,
        step: 5 * 60 * 1000,
        draggableRange: true,
        translate: (value, id, label) => {
          let minutes = (value / 60 / 1000) | 0;
          let hours = (minutes / 60) | 0;
          minutes = minutes % 60;

          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        },
      };

      return $scope.init();
    }

  ]);
})();
