import React, { useState, createContext } from 'react';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [admin, setAdmin] = useState(false);

    const storeAdmin = is_admin => {
        setAdmin(is_admin);
    }

    return (
        <AdminContext.Provider value={{ admin, storeAdmin }}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;