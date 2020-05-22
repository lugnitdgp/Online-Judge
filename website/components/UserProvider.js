import React, { createContext } from 'react';

const UserContext = createContext()

class UserProvider extends React.Component {
    state = {
        name: "",
        imagelink: "",
        score: 0
    }

    set_name = (name) => {
        this.setState({
            name: name
        })
    }

    set_imagelink = (link) => {
        this.setState({
            imagelink: link
        })
    }

    set_score = (new_score) => {
        this.setState({
            score: new_score
        })
    }

    render() {
        return (
            <UserContext.Provider
                value={{
                    name: this.state.name,
                    imagelink: this.state.imagelink,
                    score: this.state.score,
                    set_name: this.set_name,
                    set_imagelink: this.set_imagelink,
                    set_score: this.set_score
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

const UserConsumer = UserContext.Consumer

export default UserProvider
export { UserConsumer }