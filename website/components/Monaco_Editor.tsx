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

const languages = ["python", "javascript", "typescript","cpp","java",];
const themes = ["vs-light", "vs-dark"];

export default ({}) => {
  //const classes = styles();
  const [postBody, setPostBody] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("python");
  const handleSubmit = () => {
    console.log(encodeURI(postBody));
  };

  return (
    <Card style={{backgroundColor:"#f5f5f5"}} >
      <CardHeader title="Code editor" />
      <TextField
          id="outlined-select-currency"
          select
          label="Select Theme"
          style = {{width: 150}}
          margin="dense"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          variant="outlined"
        >
          {themes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      <TextField
          id="outlined-select-currency"
          select
          label="Select Language"
          // fullWidth
          style = {{width: 200}}
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
          theme={theme}
          value={postBody}
          options={{
            minimap: {
              enabled: false,
            },
            automaticLayout :true,
            scrollBeyondLastLine: false,
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

      </CardActions>
    </Card>
  );
};

// monaco.languages.registerCompletionItemProvider('dummy', {
//   provideCompletionItems: () => {
//     var suggestions = [
//       {
//         label: 'simpleText',
//         kind: monaco.languages.CompletionItemKind.Text,
//         insertText: 'simpleText',
//       },
//       {
//         label: 'testing',
//         kind: monaco.languages.CompletionItemKind.Keyword,
//         insertText: 'testing(${1:condition})',
//         insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//       },
//       {
//         label: 'ifelse',
//         kind: monaco.languages.CompletionItemKind.Snippet,
//         insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
//         insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//         documentation: 'If-Else Statement',
//       },
//     ];
//     return { suggestions: suggestions };
//   },
// });