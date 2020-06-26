import React from 'react'

export default function Alert() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <div className="alert alert-success alert-dismissible" role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <strong>Success!</strong> Alert Message
                  </div>
                </div>
            </div>
        </div>
    )
}
