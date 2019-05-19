import React from 'react';
import './Backdrop.module.scss';

const backdrop = (props) => {
	console.log('backdor :' +props.show);
	return (
		props.show ?
			<div className = "Backdrop" onClick = {props.clicked}></div> 
			:null 
		)	
}

export default backdrop;