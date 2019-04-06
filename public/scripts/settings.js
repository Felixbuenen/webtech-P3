/**
 * This file contains the logic for the form on the 'settings' page. It sends an AJAX request with form data.
 * If the email already existed, the AJAX call will return this and it will be displayed in the browser. 
 */

window.addEventListener("load", setup, false);

function setup() {
  let settings_form = document.getElementById("settings-form");

  settings_form.addEventListener("submit", event =>
    validateForm(event, settings_form)
  );
}

function validateForm(event, settings_form) {
  event.preventDefault();

  let inputs = settings_form.elements;
  let success = true;

  // check if all fields were filled in
  /*for (i = 0; i < settings_form.children.length - 1; i++) {
    if (inputs[i].value === "") {
      settings_form.children[i].children[1].innerHTML = "Field can't be empty!";
      if (success) success = false;
    } else {
      settings_form.children[i].children[1].innerHTML = "";
    }
  }*/

  // if not all fields were filled in, return
  /*if (!success) {
    event.preventDefault();
    return;
  }*/

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      success = JSON.parse(this.responseText).isValid;
      let responseMsg = document.getElementById("settings-response-msg");

      if (!success) {
        responseMsg.innerHTML = "Email already registered";
        responseMsg.style.color = "red";
      }
      else {
        responseMsg.innerHTML = "Successfully updated your settings!";
        responseMsg.style.color = "green";
      }
    }
  };
  xhttp.open("POST", "ajax/emailExists", false);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let sendData = "email=" + inputs["email"].value + "&fname=" + inputs["fname"].value + "&lname=" + inputs["lname"].value + "&password=" + inputs["password"].value;
  xhttp.send(sendData);
}
