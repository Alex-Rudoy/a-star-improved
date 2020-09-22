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
    if (button.dataset.action == "changeMode") {
      this.mode = button.dataset.mode;
      console.log(this.mode);
    }
  }
}
