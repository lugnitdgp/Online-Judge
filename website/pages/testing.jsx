import React, { useContext } from 'react'
import UserContextProvider, { UserContext } from '../components/UserContextProvider';

function test() {
    const { user, storeUser, showUser } = useContext(UserContext);

    showUser();

    const change = () => {
        storeUser({
            name: "abc",
            email: "xyz",
            image_link: "123"
        })
    };

    const view = () => {
        showUser();
    }

    showUser();

    return (
        <UserContextProvider>
            <div>
                <React.Fragment>
                    <p>{user.username}</p>
                    <p>{user.email}</p>
                    <a href={user.image} />
                </React.Fragment>
                <button onClick={change}>Click Me to update</button>
                <button onClick={view}> Click to View</button>

            </div>
        </UserContextProvider>
    )
}


export default test
