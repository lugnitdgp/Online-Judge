import React from "react";
import axios from "axios";

interface IState {
  ques: any;
}

class QuesDetail extends React.Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { ques: {} };
  }

  componentDidMount() {
    const qid = window.location.pathname.split("/").slice(-1)[0];
    let headers = {
      Authorization: `Token ${localStorage.token}`,
    };
    axios
      .get(`${process.env.BACKEND_URL}/api/quesdetail?q_id=${qid}`, {
        headers: headers,
      })
      .then((response) => this.setState({ ques: response.data }))
      .catch((error) => console.log(error));
  }

  submitcode = (code: any, lang: any) => {
    if (this.state.ques) {
      let headers = {
        Authorization: `Token ${localStorage.token}`,
      };
      axios
        .post(`${process.env.BACKEND_URL}/api/submit`, {
          headers: headers,
          params: {
            code: encodeURI(code),
            lang: lang,
            q_id: this.state.ques.question_code,
          },
        })
        .then((res) => {
          localStorage.taskid = res.data["task_id"];
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

export default QuesDetail;
