import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-kr_theme";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-min-noconflict/ext-language_tools";

interface IProps {
  value: string;
  lang: string;
}

function Viewer(props: IProps) {
  const dict = {
    c: "c_cpp",
    "c++": "c_cpp",
    python3: "python",
    java: "java",
  };
  return (
    <div style={{ overflow: "scroll" }}>
    
        <AceEditor
          mode={dict[props.lang]}
          theme={"kr_theme"}
          value={props.value}
          readOnly={true}
          fontSize={18}
          style={{ width: "100%" }}
        /></div>
  );
}

export default Viewer;
