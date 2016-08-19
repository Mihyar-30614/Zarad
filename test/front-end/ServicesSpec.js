'use strict';

describe('Services', function () {
  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
  var baseUrl = 'http://zarad.herokuapp.com';
  // Before each test load our lets-hangout.services module
  beforeEach(angular.mock.module('zarad.services'));

  afterEach(inject(function ($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  describe('Auth factory', function() {
    var $httpBackend, Auth, $window;

    // Before each test set our injected Auth factory (_Auth_) to our local Users variable
    beforeEach(inject(function(_$httpBackend_, _Auth_, _$window_) {
      Auth = _Auth_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
    }));

    // A test to verify the Auth factory exists
    it('Auth factory should exist', function() {
      expect(Auth).toBeDefined();
    });
    
    describe('.signup()', function() {
      // A test to verify the method signup exists
      it('signup should exist', function() {
        expect(Auth.signup).toBeDefined();
      });

      it('signup should POST data and username should start with Pl', function() {
        var mockResponse = 
          {
            'username':'Plmiha492',
            'password': 'play',
            'firstName' : 'Mihyar',
            'lastName' : 'almaslama',
            'country' : 'Syria',
            'email' : 'mihyar@gmail.com',
            'status' : 201
          }

        $httpBackend.expect('POST', baseUrl + '/api/user/signup').respond(mockResponse);

        Auth.signup().then(function (resp) {
          expect(resp.status).toEqual(201);
          expect(resp.username[0]).toEqual('P');
          expect(resp.username[1]).toEqual('l');
        });
        $httpBackend.flush();
      });
    });

  describe('signin()', function(){

      it('should exist', function(){
        expect(Auth.signin).toBeDefined();
      });

      it('should return token when a user signin', function(){
        $httpBackend.expect('POST', baseUrl + '/api/user/signin').respond({token:token});
        Auth.signin().then(function(resp){
        expect(resp.token).toEqual(token);
        });
        $httpBackend.flush();
      });
    });
  describe('signout()', function(){

      it('should exist', function(){
        expect(Auth.signout).toBeDefined();
      });

      it('should clear localStorage when logout', function(){
        $window.localStorage.setItem('com.zarad',token);
        Auth.signout();
        expect($window.localStorage.getItem('com.zarad')).toEqual(null);
      });
  });
  describe('isAuth()', function(){

      it('should exist', function(){
        expect(Auth.isAuth).toBeDefined();
      });

      it('should return true if the user is signed in', function(){
        var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
        $window.localStorage.setItem('com.zarad', token);
        expect(Auth.isAuth()).toEqual(true);
      });
  });
  describe('checkUser()', function(){

      it('should exist', function(){
        expect(Auth.isAuth).toBeDefined();
      })

      it('should return admin when admin logs in and user when user or club logs in', function(){
        $window.localStorage.setItem('admin', token);
        expect(Auth.checkUser()).toEqual('admin');
        $window.localStorage.clear();
        $window.localStorage.setItem('user', token);
        expect(Auth.checkUser()).toEqual('user');
      });
    });
  });

  describe('Admin factory', function(){
      var $httpBackend, Admin, $window;

      beforeEach(inject(function(_$httpBackend_, _Admin_, _$window_){
        $httpBackend = _$httpBackend_;
        Admin = _Admin_;
        $window = _$window_;
      }));

      it('Admin factory should exist', function(){
        expect(Admin).toBeDefined();
      });

  describe('signin()', function(){

      it('should exist',function(){
        expect(Admin.signin).toBeDefined();
      });

      it('should return a token when Admin signin', function(){
        $httpBackend.expect('POST', baseUrl + '/api/admin/signin').respond({token:token});
        Admin.signin().then(function(resp){
        expect(resp.token).toEqual(token);
        });
        $httpBackend.flush();
      });
  });

  });
});