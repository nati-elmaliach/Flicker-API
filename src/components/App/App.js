import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import {debounce} from 'lodash';
import Modal from '../UI/Modal/Modal';
//import 'react-sticky-header/styles.css';
//import StickyHeader from 'react-sticky-header';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      searchTerm: 'art',
      Expand:false,
      img:null,
      filterSearch:'',
      filterExecute:''
    };
  }

  callApi = debounce ((searchTerm) =>{
        this.setState({searchTerm:searchTerm});
  },500) 
  
  onSearchHandler = searchTerm =>{
    this.setState({tag:searchTerm})
    this.callApi(searchTerm)
  }

  callInfoAPI = debounce((filterExecute) =>{
      this.setState({filterExecute:filterExecute});
  },1000);
 
  onFilterHandler = filterSearch =>{
    this.setState({filterSearch:filterSearch});
    this.callInfoAPI(filterSearch);
  }

  CloseModal = () =>{
    this.setState({Expand:false})
  }

  Expend = (img) =>{
    this.setState({Expand:true,img:img});
  }
  
  render() {
    return (     
               
            
                <div className="app-root">
            <Modal 
                     show = {this.state.Expand}
                     modalClosed = {this.CloseModal}
                     img = {this.state.img}>
            </Modal> 
                <div className="app-header">
                <h2>Flickr Gallery</h2>
                
              <div className = "app-header-input" >
                <div className = "app-header-input_sides">
                <p>Search by tag name </p>
                  <input 
                    className="app-input" 
                    onChange={event => {this.onSearchHandler(event.target.value)}}
                    value ={this.state.tag}
                    />
                </div>
                <div className = "app-header-input_sides">
                <p> Filter images </p>
                <input 
                    className="app-input"
                    placeholder = "Filter by title or description"
                    onChange={event => {this.onFilterHandler(event.target.value)}}
                    value = {this.state.filterSearch} 
                    />
                </div>
              </div>
            </div>
                
              <Gallery 
                  tag={this.state.searchTerm}
                  ExpandImage = {this.Expend.bind(this)}
                  filter = {this.state.filterExecute}
                  />
              
             </div>
            
    );
  }
}

export default App;

