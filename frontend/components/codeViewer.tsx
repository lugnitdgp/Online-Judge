import React from "react";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-c_cpp";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-kr_theme";
// import "ace-builds/src-noconflict/snippets/c_cpp";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/snippets/java";
// import "ace-builds/src-noconflict/snippets/python";
// import "ace-builds/src-min-noconflict/ext-language_tools";
import dynamic from "next/dynamic";

interface IProps {
  value: string;
  lang: string;
}

const AceEditor = dynamic(
  async () => {
    const reactAce = await import("react-ace");

    await import("ace-builds/src-noconflict/mode-c_cpp");
    await import("ace-builds/src-noconflict/mode-python");
    await import("ace-builds/src-noconflict/mode-java");
    await import("ace-builds/src-noconflict/theme-tomorrow");
    await import("ace-builds/src-noconflict/theme-kr_theme");
    await import("ace-builds/src-noconflict/theme-github");
    await import("ace-builds/src-noconflict/snippets/c_cpp");
    await import("ace-builds/src-noconflict/snippets/java");
    await import("ace-builds/src-noconflict/snippets/python");
    await import("ace-builds/src-min-noconflict/ext-language_tools");

    let ace = require("ace-builds/src-min-noconflict/ace");
    ace.config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/"
    );
    ace.config.setModuleUrl(
      "ace/mode/javascript_worker",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js"
    );

    return reactAce;
  },
  { ssr : false }
);

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
          theme={"github"}
          value={decodeURI(props.value)}
          readOnly={true}
          fontSize={18}
          style={{ width: "100%" }}
        /></div>
  );
}

export default Viewer;
