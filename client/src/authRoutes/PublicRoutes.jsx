import React from 'react'
import { Route, Redirect } from "react-router-dom";

const PublicRoutes = ({
    auth,
    component: Comp,
    ...rest
}) => {
    return <Route {...rest} component={props => (
        rest.restricted ?
            (
                !auth.checking ? 
                    (
                        !auth.loggedIn ? 
                            <Comp {...props} />
                            :
                            <Redirect to='/drive/my-drive' />
                    )
                    : ""
            )
            :
            <Comp {...props} />
    )} />
}

export default PublicRoutes
