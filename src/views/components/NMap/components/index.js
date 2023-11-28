import Vue from "vue";

import latlngBar from "./latlngBar";
import navBar from "./navBar";
import widget from "./widget";

const LatlngBar = Vue.component("LatlngBar", latlngBar);
const NavBar = Vue.component("NavBar", navBar);
const Widget = Vue.component("Widget", widget);

export { LatlngBar, NavBar, Widget };
