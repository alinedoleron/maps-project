import React from 'react';

import './index.css';

import Info from './Info';

import Menu from './Menu';

export default class Map extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      searchValue: '',
      placeSelected: '',
      places: [
      {name: 'Shopping Recife', tags:['shopping recife'],lat: -8.118325, lng: -34.904851, marker: ''},
      {name: 'Shopping Rio Mar', tags:['riomar'],lat:  -8.0890166, lng: -34.9020782, marker: ''},
      {name: 'Marco Zero', tags:['marco zero'], lat:  -8.063093, lng:-34.8725169, marker: ''},
      {name: 'Parque Dona Lindu', tags: ['parque dona lindu'], lat:-8.1421002, lng: -34.9045952, marker: ''},
      {name: 'Instituto Ricardo Brennand', tags: ['brennand'],lat:-8.0642113, lng: -34.9636231, marker: ''},
      {name: 'Parque da Jaqueira', tags: ['parque da jaqueira'],lat:-8.0371023, lng: -34.9059151, marker: ''}
      ],
      searchResult: [],
      error: ''
    }

    this.redMarker = 'http://icon-park.com/imagefiles/location_map_pin_red5.png';
    this.yellowMarker = 'http://icon-park.com/imagefiles/location_map_pin_yellow5.png';
    this.scaledSize = new window.google.maps.Size(25, 35);

    this.closePlace = this.closePlace.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({searchValue: e.target.value});

    let placeSearch = e.target.value;

    let placeFound = this.state.places.filter(place => { 
      let placeName = place.name.toLowerCase()
      placeName.indexOf(placeSearch.toLowerCase()) > -1
    });
    
  
    this.renderDropdown(placeSearch, placeFound);

    if(this.state.searchResult.length != placeFound.length) {
      this.renderMap(placeFound);
    }
  }

  renderDropdown(placeSearch, placeFound) {
    if(placeSearch && placeFound) {
      this.setState({searchResult: placeFound});
    }
    else {
      this.setState({searchResult: this.state.places});
    }
  }

  resetMarkers() {
    var place = this.state.placeSelected;
    if(place && place.marker) {
      place.marker.setIcon(this.mountImage(this.redMarker, this.scaledSize));
      this.setState({placeSelected: place});
    }
    this.setState({placeSelected: ''});
  }

  mountImage(url, size) {
    return ({
      url: url,
      scaledSize: size
    });
  }

  renderMap(places) {
    let inital = {lat: -8.076316, lng: -34.9213467};
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: inital,
      zoom: 13
    });

    places.map((place) => {
      let imageDefault = this.mountImage(this.redMarker, this.scaledSize)

      let marker = new window.google.maps.Marker({
        position: {lat: place.lat, lng: place.lng},
        map: map,
        animation: window.google.maps.Animation.DROP,
        icon: imageDefault
      });

      

      marker.addListener('click', () => {

        this.resetMarkers(imageDefault);

        this.getImages(place);

        map.setCenter(marker.getPosition());  

        marker.setIcon(this.mountImage(this.yellowMarker, this.scaledSize));

        marker.setAnimation(window.google.maps.Animation.BOUNCE);

        setTimeout(function(){ marker.setAnimation(null); }, 750);

        place.marker = marker;

        this.setState({placeSelected: place});

      });

      place.marker = marker;  
    });
  }

  getImages(place) {
    let tags = place.tags.join();
    let flickrPhotosRequest = 'https://api.flickr.com/services/rest/?method='+
      'flickr.photos.search&api_key=3ec41c2ca6c30eae649009aa1310d949&format=json&nojsoncallback=1&'+
      '&tags=' + tags + '&lat=' + place.lat + '&lon='+ place.lng + '&per_page=8&radius=5&sort=relevance&extras=owner_name';

    let photoData = [];

    fetch(flickrPhotosRequest)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          result.photos.photo.map(photo => {
            let farmId = photo.farm;
            let serverId = photo.server;
            let secret = photo.secret;
            let size = 'q';
            let photoId = photo.id;
            let ownername = photo.ownername;

            let url = 'https://farm'+ farmId + '.staticflickr.com/'+
              serverId +'/'+ photoId + '_'+ secret + '_'+ size + '.jpg';

            

            photoData.push({url: url, ownerName: ownername});
          });
          place.photos = photoData;
          this.setState({placeSelected: place});
        },

        (error) => {
          this.setState({error: {message: 'Sorry, the Flickr search API is not currently available!'}})
        }
      );
  }

  closePlace() {
    this.resetMarkers();
  }

  componentDidMount() {

    this.renderDropdown();

    this.renderMap(this.state.places);

  }

  render() {
    return (
      <div id='app' className='container-fluid'>
        <div className='app-map row'>
          <div className={!this.state.placeSelected ? 'menu col-menu': 'hidden'}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder='Type a place' onChange={this.handleChange} value={this.state.searchValue}/>
              <div className="input-group-append">
              <button onClick={this.handleChange} className='btn btn-clear btn-outline-secondary' type='button'>x</button>
              </div>
            </div>
            <Menu places={this.state.searchResult}/>
          </div>
          <div className={this.state.placeSelected ? 'menu col-menu': 'hidden'}>
            <div className='pictures'>
              <nav className='navbar navbar-light bg-light'>
                  <span className='navbar-text'>
                      {this.state.placeSelected.name}
                  </span>
                  <button onClick={this.closePlace}  type='button' className='close'>
                      <span aria-hidden="true">×</span>
                  </button>
              </nav>
              <div className='source-flickr'>Fonte: Flickr</div>
              <Info className={!this.state.error ? '' : 'hidden'} placeSelected={this.state.placeSelected}/>
              <div className={this.state.error ? 'error' : 'hidden'}>
                {this.state.error.message}
              </div>
            </div>      
          </div>

          <div id='map' className='col-map' />
          
        </div>
      </div>
    );
  }
};
