import { useState, useEffect } from 'react';

export default function(props){
    const { statex } = props;
    const [inputs, setInputs] = useState(statex.inputs);
    
    useEffect(() => {
      statex.setInputs((state) => ({ ...state, inputs }));
    }, [inputs]);

    return <>
        <div className = "Input-Auth">
            <input autoComplete = "off" value = {inputs.email} name = "email" onChange = {ev => setInputs(state => {
                return {...state, [ev.target.name]: ev.target.value}
            })} placeholder = "Email"/>
        </div>
        <div className = "Input-Auth">
            <input autoComplete = "off" className = "Form-Input" value = {inputs.password} name = "password" onChange = {ev => setInputs(state => {
                return {...state, [ev.target.name]: ev.target.value}
            })} type = "password" placeholder = "Password"/>
        </div>
        
    </>;
}