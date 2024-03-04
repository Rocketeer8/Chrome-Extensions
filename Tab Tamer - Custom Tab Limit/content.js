// everything that requires DOM you put it in content.js

function tabsInfo() { 
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        // The 'tabs' array contains information about all open tabs
        // get total number of current tabs and display it
        var numberOfTabs = tabs.length;
        document.getElementById("tabsNumber").innerHTML = "Current number of tabs: " + numberOfTabs;
        
        // get the maximum allowed tabs and store it in input field
        chrome.runtime.sendMessage({ action: "getMaxTabsAllowed" }, (response) => {
            if (response) {
              console.log("THE MAX TAB RESULT IS " + response.value);
              document.getElementById("numberInput").value = response.value;
            }
        });

        // get the closing mode
        chrome.runtime.sendMessage({ action: "getClosingMode" }, (response) => {
            if (response) {
                console.log("THE CLOSING MODE RESULT IS " + response.value);
                document.getElementById(response.value).checked = true;
            }
        });
    });
}

// listener for user tab limit submission
function addSubmitEventListener() {
    // change display of number field to whatever user input is  
    document.getElementById('submitButton').addEventListener('click', function() {
        var userInput = document.getElementById('numberInput').value;
        chrome.runtime.sendMessage({action: "userInputSubmission", value: userInput});
    });
}

function closingModeListener() {
    var radioButtons = document.querySelectorAll('input[name="mode"]');

    // Add event listener to each radio button
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', function(event) {
            // Check which radio button is selected
            // event.target.value is either most recent or least active
            chrome.runtime.sendMessage({action: "closingModeSubmission", value: event.target.value});
        });
    });
}

// Wrap your code in a DOMContentLoaded listener
// It's possible that the content script is executing before the before the extension APIs are fully available
// that's why you add eventListener here
document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    tabsInfo();
    addSubmitEventListener();
    closingModeListener();
});
