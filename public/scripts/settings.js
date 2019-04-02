window.addEventListener("load", setup, false);

function setup() {
  let settings_form = document.getElementById("settings-form");

  settings_form.addEventListener("submit", event =>
    validateForm(event, settings_form)
  );
}

function validateForm(event, settings_form) {
  let inputs = settings_form.elements;
  let success = true;

  //alert(settings_form.children.length);
  for (i = 0; i < settings_form.children.length - 1; i++) {
    //alert(inputs[i].value);
    if (inputs[i].value === "") {
      //alert(settings_form.childNodes[i].childNodes[1]);
      settings_form.children[i].children[1].innerHTML = "Field can't be empty!";
      if (success) success = false;
    } else {
      settings_form.children[i].children[1].innerHTML = "";
    }
  }

  if (!success) event.preventDefault();
}
