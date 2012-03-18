function renderPlayPauseButton() {
  if(Player.playState() === 1) {
    $("#playPause").removeClass("play");
    $("#playPause").addClass("pause");
  } else {
    $("#playPause").removeClass("pause");
    $("#playPause").addClass("play");
  }
}

function updateTrackInfo(theTrack) {
  $('#trackName').html(theTrack.propertyHTML('title'));
  $('#artistName').html(theTrack.propertyHTML('artist'));
  $('#albumName').html(theTrack.propertyHTML('album'));
}

function emptyTrackInfo() {
  $('#trackName').html("Nothing");
  $('#artistName').html("Nobody");
  $('#albumName').html("Nothing");
}

// Custom Helpers            ^
/***************************************************************/
// Standard Bowtie functions v

// BTPlayStateFunction
function playStateChanged(playState) {
  renderPlayPauseButton();

  // Hide album art when stopped
  if (playState === 0) {
    $('#albumArt').hide();
    $('#time').html("");
  } else {
    $('#albumArt').show();
  }  
}

// BTReadyFunction
function setup() {
  renderPlayPauseButton();
  if(Player.playState() === 1) {
    albumArtChanged(Player.renderedArtwork());
    trackChanged(Player.currentTrack());
    statusUpdate();
  } else {
    emptyTrackInfo();
  }
}

// BTTrackFunction
function trackChanged(theTrack) { 
  if(Player.playState() === 0) { /* STOPPED */
    emptyTrackInfo();
  } else if (Player.playState() === 1 || Player.playState() === 2) { /* PLAYING OR PAUSED */
    updateTrackInfo(theTrack);
  }
}

// BTArtworkFunction
function albumArtChanged(theAlbum) {
  $('#albumArt').attr('src', theAlbum);
}

// BTStatusFunction
function statusUpdate() {

  /* Update playback time */

  // get current song progress
  var time = Player.playerPosition();
  
  // Scale Rdio's weirdo time percentage
  if (Player.name().match(/rdio/i)) {
    time = time * (Player.currentTrack().length / 100);
  }
  
  // Convert var time to minutes and seconds for display
  negTime = Player.currentTrack().length - time;
  var minutes = Math.floor(negTime / 60);
  var seconds = Math.floor(negTime % 60);
  if(seconds < 10) {
    seconds = '0'.concat(seconds);
  }

  // Handle NaN
  if (isNaN(seconds) || isNaN(minutes)) {
    $('#time').html('');
    return
  }

  // Account for long strings
  var timeString = '-'.concat(minutes , ':' , seconds);
  if (timeString.length < 7) {
    $('#time').html(timeString);
  } else {
    $('#time').html("&#8734;");
  }
}

