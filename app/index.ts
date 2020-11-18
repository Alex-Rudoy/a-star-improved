import "./scss/main.scss";
import State from "./ts/classes/State";
import addButtonHandlers from "./ts/otherLogic/addButtonHandlers";
import addMouseListeners from "./ts/otherLogic/addMouseListeners";

let state = new State();
addButtonHandlers(state);
addMouseListeners(state);
