interface IQuestion {
    question_name: string,
    question_code: string,
    question_score: number,
    question_text?: string
}

export interface IState {
    email?: string,
    name?: string,
    token?: string,
    question: Array<IQuestion>,
    selectedQuestion?: IQuestion
}

const initialState: IState = {
    question: []
}

export default initialState;