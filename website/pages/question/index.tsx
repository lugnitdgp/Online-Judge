import React from "react";
import axios from 'axios';

interface Props { }

interface State {
    list: null;
}

class questionlist extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { list: null };
    }

    componentDidMount() {
        let headers = {
            'Authorization': `Token ${localStorage.token}`;
        }
        try {
            var response = await axios.get(`${process.env.BACKEND_URL}/api/questions`, { headers: headers });
            this.setState({ list: response.data });
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            this.state.list ? <div>
                {this.state.list.map((item, i) => <div key={i}><p>{item.question_name}</p>
                    <p>{item.question_code}</p>
                    <p>{item.question_score}</p>
                </div>)}
            </div> : <div />
        );
    }
}

export default questionlist;