import React from 'react';

export default function AddNote({setStateFormVideo}){
    return (
        <button className = "default-button default-button-animation" onClick={() => setStateFormVideo('Create')}>Create</button>
    )
}