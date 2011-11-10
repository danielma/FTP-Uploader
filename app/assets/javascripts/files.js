var progressBar = {
  setProgress: function(percentage, ftp) {
    percentage = Math.round(percentage * 50); // * 100/2 cuz each half only goes halfway
    if(ftp === true) {
      percentage = percentage + 50; // We're already halfway
    }
    // console.log("after stuff = " + percentage)
    if (percentage === 0){
      // Do nothing...
    } else if (percentage<100){
      $(".progress span.bar").css({width: percentage + "%"});
      $(".progress span.text").text(percentage + "%");
    } else {
      clearInterval(progressInterval);
      $(".progress span.bar").css({width: "100%"});
      $(".progress span.text").text("Done!");
    }
  }
}

var swf = {
  fileQueued: function(file) {
    swfu.startUpload();
  },
  
  fileQueueError: function(file, errorCode, message) {
    alert(message);
  },
  
  uploadStart: function(file) {
    $(".progress").fadeIn();
    $(".progress span.text").text("Processing...")
  },
  
  uploadProgress: function(file, bytesLoaded, bytesTotal) {
    var percentage=bytesLoaded/file.size;
    // console.log(percentage);
    progressBar.setProgress(percentage);
  },
  
  uploadSuccess: function(file, server_data, recievedResponse) {    
    ftp.upload(eval("(" + server_data + ")"), file);
  },
  
  uploadComplete: function(file) {
    // Do nothing...
  }
  
};

var progressInterval;

var ftp = {
  upload: function(json, file) {
    progressInterval = setInterval(function() {
      $.getJSON("/files/check_progress",
        {filename: json.filename, size: file.size},
        function(data) {
          progressBar.setProgress(data.percentage, true);
        }
      )
    }, 3000)
  }
};