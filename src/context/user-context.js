import React from 'react';
import {useEffect, useState} from 'react';
import { auth } from '../firebase/config';
import { withRouter } from 'react-router';
import useUser from '../hooks/useUser';

const userContext = React.createContext();

export default userContext;

export const UserProvider = withRouter(({children, history}) =>{
    const [currentUser, setCurrentUser] = useState(null);
    const userData = useUser(currentUser);
    
    useEffect(() => {
        auth.onAuthStateChanged(user=>{
            if(user){
                setCurrentUser(user);
                history.push('/');
            }else{
                setCurrentUser(user);
                history.push('/auth');
            }
        });
    }, [])

    return (
        <userContext.Provider value = {{currentUser, userData}}>
            {children}
        </userContext.Provider>
    )
})