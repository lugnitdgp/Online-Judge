import React from 'react'
import { useRouter } from 'next/router';
import axios from "axios";

interface Props { }

interface State {
    ques: null;
}

class quesdetail extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ques: null };
    }

    componentDidMount() {
        const router = useRouter();
        const { qid } = router.query;

        let headers = {
            'Authorization': `Token ${localStorage.token}`
        };
        try {
            var response = axios.get(`${process.env.BACKEND_URL}/api/quesdetail?q_id=${qid}`, { headers: headers });
            this.setState({ ques: response.data });
        } catch (error) {
            console.log(error);
        }
    }

    //@ts-ignore
    submitcode = (code, lang) => {
        let headers = {
            'Authorization': `Token ${localStorage.token}`
        }
        axios.post(`${process.env.BACKEND_URL}/api/submit`, {
            headers: headers,
            params: {
                'code': encodeURI(code),
                'lang': lang,
                'q_id': this.state.ques.question_code
            }
        })
            .then((res) => { localStorage.taskid = res['task_id'] })
            .catch((error) => console.log(error))
    }

    render() {
        var detail = null;
        if (this.state.ques)
            detail = <div>
                <p>{this.state.ques.question_name}</p>
            </div>
        else
            detail = <div />
        return (
            <div>
                <p>{detail}</p>
            </div>
        );
    }
}

export default quesdetail;