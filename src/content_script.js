//import React from "react";
//import ReactDOM from "react-dom";
//import App from "./app";

(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  
  try {
    const app = document.createElement("div");
    app.id = "extension-root";
    document.body.appendChild(app);

    //ReactDOM.render(
      //<Provider store={store}>
      //<App />,
      //</Provider>,
      //document.getElementById("extension-root")
    //);
  } catch (error) {
    console.error(error);
  }
})();
