import { useEffect } from "react";
import {} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {} from "@material-ui/icons";
import * as monaco from "monaco-editor";

const styles = makeStyles(() => ({
  root: {
    height: "80vh",
    width: "90vw"
  },
}));

export default ({}) => {
  const classes = styles();

  useEffect(() => {
    monaco.editor.create(document.getElementById("container"), {
      value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
        "\n"
      ),
      language: "javascript",
    });
  }, []);
  return <div id="container" className={classes.root}></div>;
};
