import { render } from "solid-js/web";

import App from "./App";
import "./styles/app.css";

// biome-ignore lint/style/noNonNullAssertion: it will
render(() => <App />, document.getElementById("root")!);
