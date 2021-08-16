import { useContext } from 'react';
import { Route, Redirect } from 'react-router';
import UserContext from '../context/user-context';

export default function({ component: RouteComponent, ...rest}){
    const {currentUser} = useContext(UserContext);

    return (
        <Route 
            {...rest}
            render = {routeProps =>
                !!currentUser ? (
                    <RouteComponent {...routeProps}/> 
                ) : (
                    null
                )
            }
        />
    )
}