import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import './Modal.scss';

 const modal = (props) =>{ 
	
	if(!props.img) //if img is null
		return null;
	
	const dto = props.img;
	const index = dto.id.indexOf('-'); 
    let id = dto.id; 
    if(index >0)
        id = dto.id.substr(0,index);
  
    const backgroung = `https://farm${dto.farm}.staticflickr.com/${dto.server}/${id}_${dto.secret}.jpg`;

 		return (
				<div>
					<Backdrop show = {props.show} clicked = {props.modalClosed}/>
					<div 
					className = "Modal"
					style = {{
						transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
						opacity:props.show ? '1' :'0'
					 }}>
					 <img className ="img"
					 	src={backgroung} 
					 	alt="expenedsimage"/>
					</div>
				</div>	)
 }
 	

 

export default modal;

