// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("alcohol-rater-2 JS imported successfully!");
});

function goBack() {
  var previousUrl = document.referrer;
  if (previousUrl.includes("/edit")) {
    window.history.go(-2);
    setTimeout(function() {
      location.reload(); 
    }, 500); 
  } else {
    window.history.back();
  }
}


