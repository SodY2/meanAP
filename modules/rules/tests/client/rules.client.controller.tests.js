(function () {
  'use strict';

  describe('Rules Controller Tests', function () {
    // Initialize global variables
    var RulesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      RulesService,
      mockRule;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _RulesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      RulesService = _RulesService_;

      // create mock Rule
      mockRule = new RulesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Rule Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Rules controller.
      RulesController = $controller('RulesController as vm', {
        $scope: $scope,
        ruleResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleRulePostData;

      beforeEach(function () {
        // Create a sample Rule object
        sampleRulePostData = new RulesService({
          name: 'Rule Name'
        });

        $scope.vm.rule = sampleRulePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (RulesService) {
        // Set POST response
        $httpBackend.expectPOST('api/rules', sampleRulePostData).respond(mockRule);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Rule was created
        expect($state.go).toHaveBeenCalledWith('rules.view', {
          ruleId: mockRule._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/rules', sampleRulePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Rule in $scope
        $scope.vm.rule = mockRule;
      });

      it('should update a valid Rule', inject(function (RulesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/rules\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('rules.view', {
          ruleId: mockRule._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (RulesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/rules\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Rules
        $scope.vm.rule = mockRule;
      });

      it('should delete the Rule and redirect to Rules', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/rules\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('rules.list');
      });

      it('should should not delete the Rule and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
