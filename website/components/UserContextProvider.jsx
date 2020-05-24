import React, { useState, createContext } from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [user, setUser] = useState({ });

    const storeUser = new_user => {
        console.log("User: ", new_user);
        setUser({
            username: new_user['name'],
            email: new_user['email'],
            image: new_user['image_link']
        });
        console.log(user);
    }

    const showUser = () => {
        console.log(user);
    }

    const logout = () => {
        setUser({});
    }

    return (
        <UserContext.Provider value={{ user, storeUser, showUser }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider