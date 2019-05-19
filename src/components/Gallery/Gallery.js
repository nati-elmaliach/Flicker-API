import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {  
    super(props);
    this.state = {
      images: [],
      galleryWidth:window.clientWidth, 
      countCloned: 1,
      scroll:false,
      limitResults:100,
      updateGallary:true
    };

    this.getGalleryWidth = this.getGalleryWidth.bind(this);
    this.loadMoreItems = this.loadMoreItems.bind(this);
    this.getNewResults = this.getNewResults.bind(this);
    this.filterImages = this.filterImages.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state.updateGallary)
      return true;
    else 
      return false;
  }
  
  componentDidMount() {
    this.getImages(this.props.tag);
    this.filterImages(this.props.filter);
    window.addEventListener('resize',this.getGalleryWidth);
    window.addEventListener("scroll",this.loadMoreItems);
    }

  componentWillUNMount(){
      window.removeEventListener("resize", this.getGalleryWidth);
      window.removeEventListener("scroll",() => this.loadMoreItems);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  } 

  componentDidUpdate(prevProps){
      if(prevProps.filter !== this.props.filter)
          this.filterImages(this.props.filter);
  }
  getGalleryWidth(){ 
    this.setState({galleryWidth:document.getElementById('gallery-id').offsetWidth});
    console.log(this.state.galleryWidth);
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.state.limitResults}&&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }



  filterImages = (filter) =>{

    if(filter.length === 0)
      return;

    const currentImages = this.state.images;
    let filteredResults = [] ;
    const baseUrl = 'https://api.flickr.com/';

    let axioses = currentImages.map((img) => {
                  return axios({
                            url: `services/rest/?method=flickr.photos.getinfo&api_key=522c1f9009ca3609bcbaf08545f067ad&photo_id=${img.id}&&format=json&safe_search=1&nojsoncallback=1`,
                            baseURL: baseUrl,
                            method: 'GET'
                        })
            })

    Promise.all(axioses).then((results) => {
             console.log(results);
             filteredResults = results.filter((obj) => {
             if (!obj.data || !obj.data.photo) 
                  return false;
             
             const imageInfo = obj.data.photo;
             return imageInfo.title._content.includes(filter) || imageInfo.description._content.includes(filter) });

         //console.log(filteredResults);          
         this.setState({ images: filteredResults.map(res => res.data.photo),updateGallary:true});
         //console.log(this.state.images)
    })
}
  

         
  loadMoreItems(){
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const  scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom) {
      this.getNewResults(this.props.tag);
    }
  }

  getNewResults(tag){

    this.setState({limitResults: this.state.limitResults + 100})
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.state.limitResults}&&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
          const oldImages = this.state.images;
          //create an old id array
          const oldId = oldImages.map(obj =>{
            return obj.id;
          })
       
          const newImages = res.photos.photo;

          // find images that are not inside the old array
          const distinctImages = newImages.filter(obj =>{
            return !oldId.includes(obj.id);
          })
          //TODO: merge 2 arrys to prevent the dom to re-render the old images
          const allImages = oldImages.concat(distinctImages);
          this.setState({images:allImages,updateGallary:true});
         {         
        }
      });
  }

  cloneHandler(img){ 

    //destructure the img
    const ImagesArray = [...this.state.images];
    const newImage = {...img};
    
    //unique id
    const index = newImage.id.indexOf('-');
    if(index < 0)
        newImage.id = `${img.id}-${this.state.countCloned}`;
    else{
     newImage.id = img.id.substr(0,index) + '-' + this.state.countCloned;
    }

    //push to the images array
    ImagesArray.push(newImage);
    const newCount = this.state.countCloned + 1;
    this.setState({images:ImagesArray,countCloned:newCount,updateGallary:true});
  };


  renderImage = (img) => {
    this.setState({updateGallary:false})
    this.props.ExpandImage(img);
  }
  


  render() {
    return (
      <div className="gallery-root"  
           id = "gallery-id"
           ref = "iScroll"
           >
        {this.state.images.map(dto => {
          return <Image 
                  key={'image-' + dto.id} 
                  dto={dto}
                  galleryWidth={this.state.galleryWidth}
                  callBack = {this.cloneHandler.bind(this)}
                  displayImage = {this.renderImage.bind(this)}
                  />;

        })}
      </div>
    );
  }
}

export default Gallery;
