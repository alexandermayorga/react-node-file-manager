import React from 'react'
import { Route, Redirect } from "react-router-dom";

const PrivateRoutes = ({
    auth,
    user,
    component: Comp,
    ...rest
}) => {
    
    return <Route {...rest} component={(props) => (
        !auth.checking ? 
            (
                auth.loggedIn ? <Comp {...props} user={user} />
                    :
                    <Redirect to='/login' />
            )
            : ''
    )} />
}

export default PrivateRoutes
