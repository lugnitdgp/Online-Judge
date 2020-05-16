import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  TextField,
  MenuItem,
} from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
import {} from "@material-ui/icons";
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });

// const styles = makeStyles(() => ({
//   root: {
//     height: "50vh",
//     width: "60vw",
//   },
// }));

const languages = ["python", "javascript", "typescript"];

export default ({}) => {
  //const classes = styles();
  const [postBody, setPostBody] = useState("");
  const [language, setLanguage] = useState("python");
  const handleSubmit = () => {
    console.log(encodeURI(postBody));
  };

  return (
    <Card>
      <CardHeader title="Code editor" />
      <CardContent>
        <MonacoEditor
          editorDidMount={() => {
            // @ts-ignore
            window.MonacoEnvironment.getWorkerUrl = (
              _moduleId: string,
              label: string
            ) => {
              if (label === "typescript" || label === "javascript")
                return "_next/static/ts.worker.js";
              return "_next/static/editor.worker.js";
            };
          }}
          width="800"
          height="600"
          language={language}
          theme="vs-dark"
          value={postBody}
          options={{
            minimap: {
              enabled: false,
            },
          }}
          onChange={setPostBody}
        />
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
        <TextField
          id="outlined-select-currency"
          select
          label="Select Language"
          fullWidth
          margin="dense"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          variant="outlined"
        >
          {languages.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </CardActions>
    </Card>
  );
};
