import React, {useState,useEffect} from 'react'
import ReactDom from "react-dom";

export default function Modal({isOpen, close, children}) {

    const MODAL_DISPLAY = {display: "block"}
    const bodyElement = document.getElementsByTagName('body')[0]

    const [fadeIn, setFadeIn] = useState(false)
    const [fadeOut, setFadeOut] = useState(true)

    if (isOpen) {
        bodyElement.classList.add('modal-open')
    }else{
        bodyElement.classList.remove('modal-open')
    }
    
    useEffect(() => {
        let timeOut;
        if (isOpen) {
            setFadeOut(false)
            timeOut = setTimeout(() => {
                setFadeIn(true)
            }, 250);   
        }else{
            setFadeIn(false)
            timeOut = setTimeout(() => {
                setFadeOut(true)
            }, 250);  
        }
        return () => clearTimeout(timeOut)
    },[isOpen])

    function handleModalClick(e){
        const role = e.target.getAttribute('role');

        if(role && role === 'dialog') close(false);
    }

    return ReactDom.createPortal(
        <>{!fadeOut && 
            <>
                <div onClick={handleModalClick} style={MODAL_DISPLAY} className={`modal fade ${fadeIn ? 'in' : ''}`} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            {children}
                        </div>{/* <!-- /.modal-content --> */}
                    </div>{/* <!-- /.modal-dialog --> */}
                </div>{/* <!-- /.modal --> */}
                <div className={`modal-backdrop fade ${fadeIn ? 'in' : ''}`}></div>
            </>
        }</>,
        document.getElementById('modal-root')
    )
}

function Header({children}) {
    return (
        <div className="modal-header">
            {children}
            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title">Modal title</h4> */}
        </div>
    )
}
function Body({children}) {
    return (
        <div className="modal-body">
            {children}
        </div>
    )
}
function Footer({children}) {
    return (
        <div className="modal-footer">
            {children}
            {/* <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button> */}
        </div>
    )
}

Object.assign(Modal, {
    Header,
    Body,
    Footer
})