import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { Card, CardContent } from "@material-ui/core";

interface IProps {
  value: string;
  setValue: (d: string) => void;
  lang: string;
  theme: string;
}

function Editor(props: IProps) {
  const dict = {
    c: "c_cpp",
    "c++": "c_cpp",
    python3: "python",
    java: "java",
  };
  const the = {
    "theme-tomorrow": "tomorrow",
    "theme-terminal": "terminal",
    "theme-twilight": "twilight",
  };

  return (
    <Card>
      <CardContent style={{ overflow: "scroll" }}>
        <AceEditor
          mode={dict[props.lang]}
          theme={the[props.theme]}
          value={props.value}
          onChange={(e) => props.setValue(e)}
          name="UNIQUE"
          fontSize={16}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          style={{ width: "100%" }}
        />
      </CardContent>
    </Card>
  );
}

export default Editor;
