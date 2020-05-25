import React from "react";
import { GetServerSideProps } from "next";
import Cookie from "lib/models/Cookie";
import { Card, CardHeader, CardContent, Button } from "@material-ui/core";
import Editor from "components/Editor";

interface IProps {
  data: any;
}
interface IState {
  value: string;
}

class QuesDetail extends React.Component<IProps, IState> {
  constructor(props: Readonly<IProps>) {
    super(props);
    this.state = {
      value: "",
    };
  }

  submitcode = (code: any, lang: any) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        code: encodeURI(code),
        lang: lang,
        q_id: this.props.data.question_code,
      }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        localStorage.taskid = res["task_id"];
      })
      .catch((error) => console.log(error));
  };

  statuscode = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.token}`,
      },
      body: JSON.stringify({
        q_id: this.props.data.question_code,
        task_id: localStorage.taskid,
      }),
    }).then((resp) => resp.json());
  };

  render() {
    return (
      <div>
        <p>{this.props.data.question_text}</p>
        <p>{this.props.data.question_code}</p>
        <Card>
          <CardHeader title="Input Example" />
          <CardContent>
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: this.props.data.input_example,
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Output Example" />
          <CardContent>
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: this.props.data.output_example,
              }}
            />
          </CardContent>
        </Card>
        <Editor
          value={this.state.value}
          setValue={(d) =>
            this.setState({
              value: d,
            })
          }
        />
        <Button variant="outlined" onClick={() => this.submitcode("cpp", this.state.value)}>
          Submit
        </Button>
        <Button variant="outlined" onClick={() => this.statuscode()}>Check for Changes</Button>
      </div>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = new Cookie();
  cookie.parse(context.req.headers.cookie || "");

  try {
    let resp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quesdetail?q_id=${context.params?.question}`,
      {
        headers: {
          Authorization: `Token ${cookie.cookies.get("token")}`,
        },
      }
    );

    let response = await resp.json();

    return {
      props: {
        data: response,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        data: "",
      },
    };
  }
};

export default QuesDetail;
