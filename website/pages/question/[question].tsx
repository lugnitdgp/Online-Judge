import React from "react";
import { GetServerSideProps } from "next";

interface IState {
  ques: any;
}

class QuesDetail extends React.Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { ques: {} };
  }

  submitcode = (code: any, lang: any) => {
    if (this.state.ques) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.token}`,
        },
        body: JSON.stringify({
          code: encodeURI(code),
          lang: lang,
          q_id: this.state.ques.question_code,
        }),
      })
        .then((resp) => resp.json())
        .then((res) => {
          localStorage.taskid = res["task_id"];
        })
        .catch((error) => console.log(error));
    }
  };

  render() {
    var detail = null;
    if (this.state.ques)
      detail = (
        <div>
          <p>{this.state.ques.question_name}</p>
        </div>
      );
    else detail = <div />;
    return (
      <div>
        <p>{detail}</p>
      </div>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context.req.headers.cookie?.split(";"));

  try {
    let resp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quesdetail?q_id=${context.params?.question}`,
      {
        headers: {
          Authorization: `Token ${context.req.headers.cookie}`,
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
