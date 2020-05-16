import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {} from "@material-ui/icons";
import * as monaco from "monaco-editor";

const styles = makeStyles(() => ({
  root: {
    height: "50vh",
    width: "60vw",
  },
}));

export default ({}) => {
  const classes = styles();
  var editor: any;
  const [value, setValue] = useState("");

  useEffect(() => {
    editor = monaco.editor.create(document.getElementById("container"), {
      value: value,
      language: "javascript",
    });
  }, []);

  const handleSubmit = () => {
    setValue(editor.getValue());
    console.log(value);
  };

  return (
    <Card>
      <CardHeader title="Code editor" />
      <CardContent>
        <div id="container" className={classes.root}></div>
      </CardContent>
      <CardActions>
        <Button color="primary">Run {"&"} Test</Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};
