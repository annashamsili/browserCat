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
  console.log("Welcome back Ellen!");
};


// Update the display with the correct number of hearts

function updateHeartsDisplay() {
  // Clear the current hearts display
  document.getElementById("score").innerHTML = "";
  // Get the heartsArray from storage
  chrome.storage.local.get("heartsArray", function(result) {
    // If the heartsArray doesn't exist, create an empty array
    const heartsArray = result.heartsArray || [];
    // Add the correct number of hearts to the display
    for (let i = 0; i < Math.min(heartsArray.length, 5); i++) {
      const heart = document.createElement("img");
      heart.classList.add("heart");
      document.getElementById("score").appendChild(heart);
    }
    console.log("Hearts updated. You have " + heartsArray.length + " hearts.");
  });
}

// create counter for hearts

function addHeart() {
  if (hearts < 5) {
    hearts += 1;
    // Create a new heart object
    const heart = {
      id: Date.now(),
      addedTime: Date.now()
    };
    // Get the current array of heart objects
    chrome.storage.local.get("heartsArray", function(result) {
      const heartsArray = result.heartsArray || [];
      // Add the new heart object to the array
      heartsArray.push(heart);
      // Save the updated array to storage
      chrome.storage.local.set({ heartsArray: heartsArray });
    });
    // Create a new img element
    const img = document.createElement("img");
    // Set its class to "heart"
    img.classList.add("heart");
    // Set the unique id of the heart object
    img.id = heart.id;
    // Append the img element to the score element
    document.getElementById("score").appendChild(img);
    // Update the display with the correct number of hearts
    updateHeartsDisplay();
  }
}

// set removeHeart function

function removeHeart(heartId) {
  // Decrement the hearts counter
  hearts -= 1;
  // Get the hearts array from storage
  chrome.storage.local.get("heartsArray", function(result) {
    // Find the index of the heart in the hearts array
    const heartIndex = result.heartsArray.findIndex(function(heart) {
      return heart.id === heartId;
    });
    // Remove the heart from the hearts array
    result.heartsArray.splice(heartIndex, 1);
    // Save the updated hearts array to storage
    chrome.storage.local.set({ heartsArray: result.heartsArray });
    // Update the hearts display
    updateHeartsDisplay();
  });
}

// Remove hearts that have been in the display for more than 16 hours

setInterval(function() {
  // Get all the hearts in the display
  const current = Date.now();
  chrome.storage.local.get("heartsArray", function(result) {
    // Get the array of heart objects
    const heartsArray = result.heartsArray || [];
    // If the array is empty, return from the function
    if (heartsArray.length === 0) {
      return;
    }
    for (const heart of heartsArray) {
      // Calculate the interval between the current time and the time the heart was added
      const interval = current - heart.addedTime;
      // Check if the interval is greater than 10 minutes (600000 milliseconds)
      if (interval > 43000000) {
        // Remove the heart
        removeHeart(heart.id);
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