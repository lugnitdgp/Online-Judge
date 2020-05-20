import React from 'react'
import { useRouter } from 'next/router';
import axios from "axios";
import { useState, useEffect } from 'react';

class quesdetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ques: null };
    }

    componentDidMount() {
        const qid= window.location.pathname.split('/').slice(-1)[0];
        let headers = {
            'Authorization': `Token ${localStorage.token}`
        };
        axios.get(`${process.env.BACKEND_URL}/api/quesdetail?q_id=${qid}`, { headers: headers })
            .then((response) => this.setState({ ques: response.data }))
            .catch((error) => console.log(error));
    }


    //@ts-ignore
    submitcode = (code, lang) => {
        if (this.state.ques) {
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
            }).then((res) => { localStorage.taskid = res['task_id'] })
                .catch((error) => console.log(error))
        }
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
