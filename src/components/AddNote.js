import React, { useContext } from 'react';
import { stateFormVideoContext } from '../context/form-video-context';

export default function AddNote(){
  const { setStateFormVideo } = useContext(stateFormVideoContext);

    return (
        <button className = "default-button default-button-animation" onClick={() => setStateFormVideo('Create')}>Create</button>
    )
}