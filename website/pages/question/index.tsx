import React from "react";

interface IState {
  list: Array<any>;
}

class questionlist extends React.Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { list: [] };
  }

  componentDidMount() {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions`, {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((res) => this.setState({ list: res }))
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        {this.state.list.map((item, i) => (
          <div key={i}>
            <a href={`/question/${item.question_code}`}>{item.question_name}</a>
            <p>{item.question_code}</p>
            <p>{item.question_score}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default questionlist;
