

// DOM Ready =============================================================
$(document).ready(function() {
  //verify that the user is allowed here
  if(!$.cookie('name') || !$.cookie('password')) {
    window.location = '/';
  } else {
    $.ajax({
      type: 'GET',
      url: '/users/login/' + $.cookie('name') + '/' + $.cookie('password'),
      dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.retStatus != 'Success') {
          window.location = '/';
        }
      })
  }
  //fill in the table of complaints
  populateComplaints();
});

// Functions =============================================================
var users;
var map;
var markers = [];

function populateComplaints() {
  var firebaseRef = new Firebase("https://issuemapping.firebaseio.com");
  firebaseRef.on('value', function(snapshot) {
    $('ul#complaintlist').empty();
    markers = [];
    users = snapshot.val().users;
    for(var uid in users) {
      var message = users[uid].details;
      var location = users[uid].location;
      var phone = users[uid].user_id;
      //convert the date to a Javascript Date Object
      var date = new Date(users[uid].date);
      $('ul#complaintlist').prepend('<p onclick="display(\'' + uid + '\');">' + date.toDateString() + ':  ' + message + '</p>');
    }
    initgooglemaps(users);
  });
}

function display(uid) {
  //set the data in the detail view to this uid
  var message = users[uid].details;
  var phone = users[uid].user_id;
  //convert the date to a Javascript Date Object
  var date = new Date(users[uid].date);
  $('#textinfo #date').text(date.toDateString());
  //the following line formats the phone number from +1234567890 to +1 123-456-7890
  $('#textinfo #phone').text(phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 $2-$3-$4'));
  $('#textinfo #message').text(message);
  //zoom in the map to the point associated with this uid
  map.setCenter(markers[uid].position); 
  smoothZoom(map, 12, map.getZoom());
}

// the smooth zoom function
function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
            return;
        }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)},100); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}  


function logout() {
  event.preventDefault();

  //remove the cookies
  $.removeCookie('name');
  $.removeCookie('password');
  //send the user back to the main page
  window.location = "/";
}

function initgooglemaps(users) {
  // console.log(users);
  initialize();
  function initialize() {
    var center = new google.maps.LatLng(32.807202, -55.508506);
    var mapOptions = {
      zoom: 3,
      center: center
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    for(var uid in users) {
      var position = new google.maps.LatLng(users[uid].location.latitude, users[uid].location.longitude);
      markers[uid] = new google.maps.Marker({ 
        position: position,
        map: map,
        title: users[uid].details
      });
      google.maps.event.addListener(markers[uid], 'click', function() {
        display(uid);
      });
    }
    };
  google.maps.event.addDomListener(window, 'load', initialize);
}