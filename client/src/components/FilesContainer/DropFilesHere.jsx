import React from 'react'

export default function DropFilesHere({ setDragging }) {
    return (
        <div className="well text-center" style={{
            paddingTop: "10%",
            paddingBottom: "10%",
            fontSize: "30px",
            boxShadow: "0 0 5px 2px rgb(51 122 183 / 0.6)",
            color: "#337ab7"
        }} draggable="false">

            <span className="glyphicon glyphicon-cloud-upload" style={{
                fontSize: "60px", marginBottom: "15px"
            }} aria-hidden="true" draggable="false"></span>
            <div>Drop Files Here...</div>

        </div>
    )
}
