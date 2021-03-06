'use strict';

angular.module('zarad.admin',[])

.controller('AdminController',function($scope, $window, $location,Admin, $state, $ionicPopup, $timeout, Club, Tournament){
  $scope.admin={};
  $scope.club = {};
  $scope.tournament = {};
  $scope.user={};
  $scope.admins={};
  $scope.adminSelect={};
  $scope.clubs = {};
  $scope.clubSelect={};
  $scope.tournaments={};
  $scope.tournamentSelect={};
  $scope.adminUsername=$window.localStorage.getItem('admin');

  $scope.upload = function() {
    //imgur id
    var  IMGUR_CLIENT_ID = 'e5483dd45cb276b';
    // upload to imgur function
    var uploadToIMGUR = function(clientid, imgData, callback) {
      $.ajax({
        url: 'https://api.imgur.com/3/image',
        headers: {
          'Authorization': 'Client-ID ' + clientid,
          'Accept': 'application/json'
        },
        type: 'POST',
        data: {
          'image': imgData,
          'type': 'base64'
        },
        success: function success(res) {
          if (callback) {
            callback(res.data);
          }
        }
      });
    };
  
    // git data from local machine and translate it to 64 base image
     var fileBt = $('<input>').attr('type','file');

     fileBt.on('change', function(){
      var file = fileBt[0].files[0];
      var reader = new FileReader();
      reader.addEventListener('load', function(){
        var imgData = reader.result.slice(23);
        // sending the decoded image to IMGUR to get a link for that image
        uploadToIMGUR(IMGUR_CLIENT_ID, imgData, function(result){
          $scope.tournament.poster = result.link;
        });
      });
      // using the reader to decode the image to base64
      reader.readAsDataURL(file);
    });
     fileBt.click();
  };

  //admin sign in
  $scope.signin=function(){
    Admin.signin({username: $scope.admin.username, password:$scope.admin.password})
    .then(function(resp){
      if(resp.status !== 500){
      $window.localStorage.setItem('admin',resp.data.user);
      $window.localStorage.setItem('com.zarad',resp.data.token);
      $location.path('/AdminAction');
      }else{
        $ionicPopup.alert({
          title : resp.data
        });
      }
    });
  };

  //this is Admin log in pop up 
  $scope.showPopup = function() {
 //custom popup to show login box
 var myPopup = $ionicPopup.show({
  template: '<label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" id="n" placeholder="Enter First Name" ng-model="admin.username"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="password" placeholder="Enter your password" ng-model="admin.password"></label>',
  title: '<p>Enter your login information</p>',
   subTitle: 'Please fill all the fields',
   scope: $scope,
   buttons: [
     { text: 'Cancel',
     type: 'button button-outline icon icon-left ion-close-round button-dark bt',
      },
     {
       text: '<b>Login</b>',
       type: 'button button-outline icon icon-left ion-unlocked button-dark bt',
       onTap: function(e) {

         if (!$scope.admin.username || !$scope.admin.password) {
           //don't allow the admin to close unless they fill the fields
           e.preventDefault();
         } else {
           $scope.signin();
         }
       }
     },
   ]
 });
 myPopup.then(function(){
  $scope.admin = {};
 });
};


  $scope.signout=function(){
    $scope.adminUsername='';
    Admin.signout();
  };
  //get a list of all admins
  $scope.getAdmins =function () {
    Admin.getAdmins()
    .then(function (admins) {
      $scope.admins.data = admins;
    });
  };

  //get a list of all clubs 
  $scope.getClubs = function () {
    Club.getClubs()
    .then(function (clubs) {
      $scope.clubs.data = clubs;
    });
  };

  //get all Tournaments
  $scope.getTournaments = function () {
    Tournament.getAllTournament()
    .then(function (tournaments) {
      $scope.tournaments.data = tournaments;
    });
  };

  //search for a specific tournament
  $scope.SearchAboutTournament=function(){
    Tournament.SearchAboutTournament($scope.tournamentSelect.value)
    .then(function(tournament){
        $scope.tournament.name=tournament.data.name;
        $scope.tournament.place=tournament.data.place;
        $scope.tournament.details=tournament.data.details;
        $scope.tournament.organizer=tournament.data.organizer;
        $scope.tournament.Date=tournament.data.Date;
        $scope.img=tournament.data.poster;
    });
  };

     //delete admin function
  $scope.deleteAdmin = function () {
    
    $ionicPopup.show({
    template: '<select ng-model="adminSelect.value" style="height:37px"  class="item item-input item-select" ><option ng-repeat="admin in admins.data">{{admin.username}}</option></select>',
    title: '<p>Enter Admin UserName to delete</p>',
     subTitle: 'Please select Admin from the list',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       type: 'button button-outline icon icon-left ion-close-round button-dark bt',
        },
       {
         text: '<b>Remove</b>',
         type: 'button button-assertive icon icon-left ion-trash-a',
         onTap: function() {
           Admin.deleteAdmin({username:$scope.adminSelect.value})
          .then(function (admin) {
            $scope.adminSelect = {};
            $scope.getAdmins();
            $ionicPopup.alert({
              title : admin
            });
          });
         }
       },
     ]
   });
  };
  //Register a new Admin
  $scope.registerAdmin = function () {

    $ionicPopup.show({
    template: '<label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Admin Username" ng-model="admin.username"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="password" placeholder="Admin Password" ng-model="admin.password"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Admin Email" ng-model="admin.email"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Admin FirstName" ng-model="admin.firstName"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Admin LastName" ng-model="admin.lastName"></label>',
    title: '<p>Enter Admin UserName to delete</p>',
     subTitle: 'Please fill the fields below',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       type: 'button button-outline icon icon-left ion-close-round button-dark bt',
        },
       {
         text: '<b>Register</b>',
         type: 'button button-balanced icon icon-left ion-person-add',
         onTap: function() {
           Admin.signup($scope.admin).then(function(resp){
             $ionicPopup.alert({
             title: 'Admin Created: '+resp.username
              });
            $scope.admin = {};
          });
         }
       },
     ]
   });
  };
  // Delete existing club 
  $scope.removeClub = function () {

    $ionicPopup.show({
    template : '<select ng-model="clubSelect.value"  style="height:37px"  class="item item-input item-select"><option ng-repeat="club in clubs.data">{{club.username}}  {{club.clubName}}</option></select>',
    title: '<p>Please select Club to delete</p>',
     subTitle: 'Please select Club Username',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       type: 'button button-outline icon icon-left ion-close-round button-dark bt',
        },
       {
         text: '<b>Remove</b>',
         type: 'button button-assertive icon icon-left ion-trash-a',
         onTap: function() {
           Club.removeClub({username : $scope.clubSelect.value.split(' ')[0]}).then(function (resp) {
            $scope.club.username = {};
            $scope.getClubs();
             $ionicPopup.alert({
              title : resp
            });
           });
         }
       },
     ]
   });
  };
  // Create new Club
  $scope.Addclub = function () {

    $ionicPopup.show({
    template: '<label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="password" placeholder="Club Password" ng-model="club.password"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Club Name" ng-model="club.clubName"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Country" ng-model="club.country"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="email" placeholder="Email" ng-model="club.email"></label>',
    title: '<p>Creating New Club</p>',
     subTitle: 'Please fill the following fields',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       type: 'button button-outline icon icon-left ion-close-round button-dark bt',
        },{
         text: '<b>Create</b>',
         type: 'button button-balanced icon icon-left ion-plus-circled',
         onTap: function(e) {
          Club.Addclub($scope.club).then(function (resp) {
            $scope.club = {};
            $ionicPopup.alert({
             title: 'Your User Name is:'+resp.username
              });
          });
         }
       },
     ]
   });
  };


   
  // Create new tournament
  $scope.addTournament = function () {
    $ionicPopup.show({
    template: '<label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Tournament Name" ng-model="tournament.name"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Tournament place" ng-model="tournament.place"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Details" ng-model="tournament.details"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Tournament organizer" ng-model="tournament.organizer"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Tournament Date" ng-model="tournament.Date"></label><br><label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input class="bottom-marg-15" type="button" value="choose Poster" ng-click="upload()"></label> <br>',
    title: '<p>Creating New Tournament</p>',
     subTitle: 'Please fill the following fields',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       type: 'button button-outline icon icon-left ion-close-round button-dark bt',
        },{
         text: '<b>Create</b>',
         type: 'button button-balanced icon icon-left ion-plus-circled',
         onTap: function() {
          Tournament.AddTournament($scope.tournament)
          .then(function () {
            $scope.tournament = {};
            $ionicPopup.alert({
              title : 'Tournamet Created'
            });
          });
         }
       },
     ]
   });
  };
  // Remove tournament 
  $scope.removeTournament = function () {

     $ionicPopup.show({
    template :'<select ng-model="tournamentSelect.value" style="height:37px"  class="item item-input item-select" ><option ng-repeat="tournament in tournaments.data">{{tournament.name}}</option></select>',
    title: '<p>Please Select Tournament Name to delete</p>',
     subTitle: 'Please Tournament Name from the list',
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       type: 'button button-outline icon icon-left ion-close-round button-dark bt',
        },
       {
         text: '<b>Remove</b>',
         type: 'button button-assertive icon icon-left ion-trash-a',
         onTap: function() {
          Tournament.DeleteTournament({name:$scope.tournamentSelect.value})
          .then(function (resp) {
            $scope.getTournaments();
            $ionicPopup.alert({
              title : resp
            });
          });
         }
       },
     ]
   });
  };

  // Edit tournament function 
 $scope.editTournament = function () {

    $ionicPopup.show({
    template: 'Please select tournament from below <br><select style="height:37px"  ng-model="tournamentSelect.value" style="height:37px" ng-change="SearchAboutTournament()" class="item item-input item-select" ><option ng-repeat="tournament in tournaments.data">{{tournament.name}}</option></select><br><br> Tournament place <label class="item item-input"> <i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Tournament place" ng-model="tournament.place"></label><br>Details<label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Details" ng-model="tournament.details"></label><br> Tournament Organizer<label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Tournament organizer" ng-model="tournament.organizer"></label><br>Tournament Date<label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" placeholder="Tournament Date" ng-model="tournament.Date"></label><br> Poster <label class="item item-input"><i class="icon ion-arrow-right-b placeholder-icon"></i><input type="text" class="bottom-marg-15" type="button" value="choose Poster" ng-click="upload()"></label><label ></br><li style="display: block"  ng-model="img"><img ng-show="img" border="0px" style="margin-left:30px" width="300px" height="200px" src={{img}} /></li></label><br>',
    title: '<p>Edit Existing Tournament</p>',
     
     scope: $scope,
     buttons: [
       { text: 'Cancel',
       type: 'button button-outline icon icon-left ion-close-round button-dark bt',
        },{
         text: '<b>Edit</b>',
         type: 'button button-balanced icon icon-left ion-edit',
         onTap: function() {
          Tournament.EditTournament($scope.tournament)
          .then(function () {
            $scope.tournament = {};
            $ionicPopup.alert({
             title: 'Tournamet Edited'
              });
          });
         }
       },
     ]
   });
  };
});
