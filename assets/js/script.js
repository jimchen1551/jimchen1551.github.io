const links = document.getElementsByTagName("a");
for(var i = 0; i < links.length; i++){
  links[i].target = "_blank";
}

// Applying Light mode...
const modeToggleBtn = document.getElementById("mode-toggle-btn");
const modeBtn = document.getElementById("mood-btn");
const modeIcon = document.getElementById("mood-icon");
const lightModeKey = "light-mode";

const updateLightMode = (enabled) => {
  // 1. Toggle the class on the body
  document.body.classList.toggle("light-mode", enabled);
  modeBtn.classList.toggle("light-mode", enabled);
  if (enabled){
    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");
  }
  else {
    modeIcon.classList.remove("fa-sun");
    modeIcon.classList.add("fa-moon");
  }

  // 2. Update lightMode in localStorage
  localStorage.setItem(lightModeKey, enabled ? "enabled" : "disabled");
};

if (!localStorage.getItem(lightModeKey)){
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    updateLightMode(true);
  } 
}
else {
  updateLightMode(localStorage.getItem(lightModeKey) === "enabled");
}

// Toggle light mode when the button is clicked
modeToggleBtn.addEventListener("click", () => {
  // Toggle the current lightMode setting
  updateLightMode(localStorage.getItem(lightModeKey) !== "enabled");
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// testimonials variables
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}


// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
      // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
      return window.clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
          return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      }
      catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return prompt("Copy to clipboard: Ctrl+C, Enter", text);
      }
      finally {
          document.body.removeChild(textarea);
      }
  }
}

function loadModal(testimonial) {
    modalTitle.innerHTML = testimonial.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = testimonial.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
}

function copyText() {
  // Get the text field
  var copyText = modalText.textContent;

   // Copy the text inside the text field
   copyToClipboard(copyText.trim());

  // Alert the copied text
  alert("BibTeX copied!");
}

function download() {
  var text = modalText.textContent.trim();
  var filename = text.split(",")[0].split("{")[1]+".bib";
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function toggle(item) {
  id = item.getAttribute("key");
  document.getElementById("bib"+id).classList.toggle("active");
}

const auxData = YAML.load("files/aux.yml")

function findAux(item) {
  item.querySelectorAll(".bibitem").forEach(entry => {
  id = entry.querySelector(".entry").getAttribute("key");
  itemData = auxData[id];
  for (const key in itemData) {
    if (itemData.hasOwnProperty(key)) {
        if (key == "abs") {
          entry.querySelector(".clickables").insertAdjacentHTML("afterbegin", 
          '<span><a class="link" target="_self" role="button" key='+ id + ' onclick="toggle(this)">abs</a></span> ');
          entry.querySelector(".abs").insertAdjacentHTML("afterbegin", '<pre>'+itemData['abs']+'</pre> ');
        } else if (key == "note") {
          entry.querySelector(".note").insertAdjacentHTML("afterbegin", '<br/><i> — '+itemData['note']+'— </i>');
        } else {
          entry.querySelector(".clickables").insertAdjacentHTML("beforeend", 
          '<span><a class="link" target="_blank" href='+ itemData[key] +' role="button">'+
          key +'</a></span> ');
        }
    }
    }
  })
}

Array.from(document.getElementsByClassName('last-modified')).forEach(element => {
  element.innerHTML= new Date(document.lastModified).toLocaleString('en-US', { month: 'short', year: "numeric"});
});


function encodeEmail(email, key) {
  var encodedKey = key.toString(16);
  var encodedString = make2DigitsLong(encodedKey);
  var result = ""; 
  for(var n=0; n < email.length; n++) {
      var charCode = email.charCodeAt(n);
      var encoded = charCode ^ key;
      var value = encoded.toString(16);
      result += make2DigitsLong(value);
  }
  result += encodedString;
  return result;
}

function make2DigitsLong(value){
  return value.length === 1 
      ? '0' + value
      : value;
}

function decodeEmail(encodedString) {
  var email = ""; 
  var keyInHex = encodedString.substr(encodedString.length - 2);
  var key = parseInt(keyInHex, 16);
  for (var n = 0; n < encodedString.length - 2; n += 2) {
      var charInHex = encodedString.substr(n, 2)
      var char = parseInt(charInHex, 16);
      var output = char ^ key;
      email += String.fromCharCode(output);
  }
  return email;
}


var protectedElements = document.getElementsByClassName("protected");
for (var i = 0; i < protectedElements.length; i++) {
    var encoded = protectedElements[i].getAttribute("eml");
    var decoded = decodeEmail(encoded);
    protectedElements[i].href = 'mailto:' + decoded;
}