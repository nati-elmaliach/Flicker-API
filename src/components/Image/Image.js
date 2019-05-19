import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import LazyLoad from 'react-lazyload';


class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number 
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.ClickFilterHandler = this.ClickFilterHandler.bind(this); 
    this.state = {
      size:200,
      filter: 'none',
      Clone: false
    };
    
  } 

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size:size
    });
  }

  componentDidMount() {
    this.calcImageSize(); 
    window.addEventListener('resize',this.calcImageSize)
  }
  
  componentWillUnmount(){
      this.calcImageSize();
      window.removeEventListener('resize', this.calcImageSize);
  }

  urlFromDto(dto) {
     const index = dto.id.indexOf('-'); 
     let id = dto.id; 
     if(index >0)
         id = dto.id.substr(0,index);
  
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${id}_${dto.secret}.jpg`;
  }

  ClickFilterHandler = () =>{
    const currentFilter = this.state.filter;
    const filtersArray = ['grayscale(100%)','invert(100%)','hue-rotate(180deg)','contrast(200%)','sepia(100%)'];
    let filter = filtersArray[Math.floor(Math.random() * filtersArray.length)];

    // ensure the filter will always change
    while(currentFilter == filter)
        filter = filtersArray[Math.floor(Math.random() * filtersArray.length)];
    this.setState({filter:filter});
  } 
 
  ClickCloneHandler =() =>{
    this.props.callBack(this.props.dto);
  }

  ClickExpandHandler = () =>{
    this.props.displayImage(this.props.dto)
  }

  render() { 
   
    return ( 
      <div  
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          filter: this.state.filter
        }}
        > 
        <div>
          <FontAwesome 
                      className="image-icon" 
                      name="clone" 
                      title="clone"
                      onClick = {this.ClickCloneHandler.bind(this) } />
          <FontAwesome className="image-icon" name="filter" title="filter"
                       onClick = {this.ClickFilterHandler}/>
          <FontAwesome className="image-icon" name="expand" title="expand"
                        onClick = {this.ClickExpandHandler.bind(this)}/>
        </div>
      </div> 
    );
  }
}

export default Image;
