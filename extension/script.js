var cat = document.getElementById("cat");
var yarn = document.getElementById("yarn");
var bowl = document.getElementById("bowl");

// get cat name and display it

chrome.storage.local.get("catName", function(result) {
  const catName = result.catName; // get the input from local storage
  if (catName) { // if the input exists
    document.getElementById("catName").innerHTML = catName; // display the input on the page
    document.getElementById("form").style.display = "none"; // hide the form
  }
});

document.getElementById("form").addEventListener("submit", function(event) {
  event.preventDefault(); // prevent the form from submitting
  // somewhere here is the check for the input - don't ask for the user input if it's already there
  chrome.storage.local.get("catName", function(result) {
    let catName = result.catName; // get the input from local storage
    if (!catName) { // if the input does not exist
      catName = document.getElementById("input").value; // get the user's input from the form
    }
    chrome.storage.local.set({ catName: catName }, function() {
      // save the input to local storage
      console.log("Thank you for naming me!");
      document.getElementById("form").style.display = "none"; // hide the form
    });
  });
});

// When the window loads, check the number of hearts in local storage
let hearts = 0;

window.onload = function() {
  chrome.storage.local.get("hearts", function(result) {
    if (result.hearts && result.hearts > 0) {
      hearts = result.hearts;
    }
    // Update the display with the correct number of hearts
    updateHeartsDisplay();
  });
  console.log("ou have " + hearts + " hearts.");
};


// Update the display with the correct number of hearts

function updateHeartsDisplay() {
  // Clear the current hearts display
  document.getElementById("score").innerHTML = "";
  // Add the correct number of hearts to the display
  for (let i = 0; i < Math.min(hearts, 5); i++) {
    const heart = document.createElement("img");
    heart.classList.add("heart");
    document.getElementById("score").appendChild(heart);
  }
  console.log("Hearts updated. You have " + hearts + " hearts.");
}

// create counter for hearts

function addHeart() {
  if (hearts < 5) {
    hearts += 1;
    chrome.storage.local.set({ hearts: hearts });
    // Create a new img element
    const heart = document.createElement("img");
    // Set its class to "heart"
    
    heart.classList.add("heart");
    // Set a unique id
    let date_now = Date.now();
    heart.id = date_now
    //chrome.storage.local.set({ [heart.id]: date_now });

    //update 23rd dec
    chrome.storage.local.get('hearts', function(result) {
      let heartsArray = result.hearts || [];
      heartsArray.push({ id: heart.id, addedTime: Date.now() });
      chrome.storage.local.set({ hearts: heartsArray });
    });


    console.log("Heart was added:", heart.id)
    // Save the heart to storage
    // Append the heart to the score element
    document.getElementById("score").appendChild(heart);
    // Update the display with the correct number of hearts
    updateHeartsDisplay();
  }
}

// set removeHeart function

function removeHeart(heartId) {
    hearts -= 1;
    if (hearts <= 0) {
    hearts = 0;
    }
    //chrome.storage.local.set({ hearts: hearts });
    // Get the first child (heart) of the score element
    const heart = document.getElementById(heartId);

    //update 23rd dec
    chrome.storage.local.get('hearts', function(result) {
      let heartsArray = result.hearts || [];
      heartsArray = heartsArray.filter(h => h.id !== heartId);
      chrome.storage.local.set({ hearts: heartsArray });
    });

    // Remove it from the score element
    //if (heart) {
      //document.getElementById("score").removeChild(heart);
      //chrome.storage.local.remove(heartId);
      //console.log("Come back soon!");
    //}
    updateHeartsDisplay();
  }

// Remove hearts that have been in the display for more than 16 hours

/*setInterval(function() {
  // Get all the hearts in the display
  const current = Date.now();
  chrome.storage.local.get(null, function(result) {
    for (const heartId in result) {
      const addedTime = result[heartId];
      
      // Calculate the interval between the current time and the time the heart was added
      const interval = current - addedTime;
      // Check if the interval is greater than 10 minutes (600000 milliseconds)
      console.log("Heart interval:", interval)
      if (interval > 600000) {
        // Remove the heart
        removeHeart(heartId);
        console.log("heart removed");
        break;
      }
    }
  });
}, 10000); */

setInterval(function() {
  // Get all the hearts in the display
  const current = Date.now();
  //chrome.storage.local.get(null, function(result) {
    // Get the array of heart IDs
    //const heartIds = Object.keys(result);
    // If the array is empty, return from the function
    //if (heartIds.length === 0) {
      //return;
    //}

    //update dec 23rd
    chrome.storage.local.get('hearts', function(result) {
    const heartsArray = result.hearts || [];
    for (const heartId of heartId) {
      const addedTime = hearts.addedTime;
      console.log("Current time:", current)
      console.log("Heart added time:", addedTime)
      // Calculate the interval between the current time and the time the heart was added
      const interval = current - addedTime;
      // Check if the interval is greater than 10 minutes (600000 milliseconds)
      console.log("Heart interval:", interval)
      if (interval > 600000) {
        // Remove the heart
        removeHeart(heartId);
        console.log("heart removed");
        break;
      }
    }
  });
}, 10000);

// add event listeners for the different clicks

cat.addEventListener("click", purr);
bowl.addEventListener("click", feed);
yarn.addEventListener("click", play);


// functions to enable animations

function play(){  
    yarn.classList.add("play");
    cat.classList.add("push");
    yarn.addEventListener("animationend", function() {
      yarn.classList.remove("play");
    });
    cat.addEventListener("animationend", function() {
      cat.classList.remove("push");
    });
    addHeart();
    console.log('Again! Again!');
}

function feed(){
    cat.classList.add("eat");
    cat.addEventListener("animationend", function() {
      cat.classList.remove("eat");
    });
    addHeart();
    console.log('Yum!');
}

function purr(){
    cat.classList.add("purr");
    cat.addEventListener("animationend", function() {
      cat.classList.remove("purr");
    });
    addHeart();
    console.log('Purr');
}