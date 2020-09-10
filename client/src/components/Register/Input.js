import React from 'react'

export default function Input(props) {

    function inputValidation(e) {
        // if (props.name === 'email') console.log('this is email')
        // console.log(e.target.value)
    }

    return <input 
    type={props.type} 
    className="form-control" 
    id={props.id} 
    name={props.name} 
    placeholder={props.placeholder} 
    onChange={props.onChange}
    onBlur={inputValidation}
    />
}
