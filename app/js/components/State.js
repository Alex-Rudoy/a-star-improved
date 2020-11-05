import Field from "./Field";

export default class State {
  constructor() {
    this.field = new Field();
    this.mode = "walls";
    this.buttons = document.querySelectorAll(".button");
    this.buttons.forEach((button) => button.addEventListener("click", (e) => this.buttonClickHandler(e)));
  }

  buttonClickHandler(e) {
    let button = e.target;
    let p = button.parentNode.parentNode.children[0];
    if (button.dataset.action == "changeMode") {
      this.mode = button.dataset.mode;
      p.innerHTML = button.innerHTML;
    }
  }
}
