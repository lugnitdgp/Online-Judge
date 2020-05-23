import React, { Component } from 'react'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow";
import { Ace } from 'ace-builds';

class Editor extends Component {

    onChange = (newValue) => {
        console.log("change", newValue);
    }

    render() {
        return (
            <div>
                <AceEditor
                    mode="c_cpp"
                    theme="tomorrow"
                    onChange={this.onChange}
                    name="UNIQUE"
                    editorProp={{ $blockScrolling: true}}
                    height="800px"
                    width="800px"
                    fontSize={16}
                />
            </div>
        )
    }
}

export default Editor
