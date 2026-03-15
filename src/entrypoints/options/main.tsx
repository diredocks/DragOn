import { render } from "solid-js/web";

import App from "./App";
import "./styles/index.css";

// biome-ignore lint/style/noNonNullAssertion: it will
render(() => <App />, document.getElementById("root")!);
