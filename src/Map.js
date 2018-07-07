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
      open: true,
      searchResult: [],
      error: ''
    }

    this.redMarker = 'http://icon-park.com/imagefiles/location_map_pin_red5.png';
    this.yellowMarker = 'http://icon-park.com/imagefiles/location_map_pin_yellow5.png';

    this.loadMap = this.loadMap.bind(this);
    this.closePlace = this.closePlace.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  ensureOpen() {
    if(!this.state.open) {
      this.setState({open: true});
    }
  }

  toggleMenu() {
    this.setState({open: !this.state.open});
  }

  //Method to initialize maps
  loadMap(){
      this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -8.076316, lng: -34.9213467},
      zoom: 13
    });

    this.scaledSize = new window.google.maps.Size(25, 35);
    this.addMarkers();
    this.renderPlaces(this.state.places);
  }

  //Add a marker for each place on the map
  addMarkers() {
    this.state.places.forEach((place) => {

      /*
        Set the defaut marker with red color
      */
      let imageDefault = this.mountImage(this.redMarker, this.scaledSize)

      /* 
        Set marker position, animation and image
      */
      let marker = new window.google.maps.Marker({
        position: {lat: place.lat, lng: place.lng},
        map: this.map,
        animation: window.google.maps.Animation.DROP,
        icon: imageDefault
      });

      place.marker = marker;
      
      /*
        Add a click event to the marker, that centralize the map on the marker selected, 
        change marker color to yellow and load places pictures
      */
      marker.addListener('click', () => {
        this.switchMarker(place);
        this.getImages(place);

        this.map.panTo(marker.getPosition());
        this.setState({placeSelected: place});
      });
    });
  }

  /* 
    Handle input search
  */
  handleChange(e) {
    this.setState({searchValue: e.target.value});

    let placeSearch = e.target.value;

    //Check if the typed place exists
    let placesFound = this.state.places.filter(place =>  
      place.name.toLowerCase().indexOf(placeSearch.toLowerCase()) > -1
    );
    
    this.renderPlaces(placesFound);
  }


  renderPlaces(places) {
    this.setState({searchResult: places});

    places.map((place) => place.marker.setVisible(true));

    let selectedPlaces = new Set(places);
    
    //Verify which places were found on the search and set the ones not found to invisible
    this.state.places.forEach((place) => {
      if (!selectedPlaces.has(place))
        place.marker.setVisible(false);
    })
  }

  // Switches between the markers
  switchMarker(newPlace) {
    let place = this.state.placeSelected;

    //ensure that menu sidebar is opened everytime a marker or place is selected
    this.ensureOpen();

    //if there is a place already selected, reset marker color to red
    if(place) {
      place.marker.setIcon(this.mountImage(this.redMarker, this.scaledSize));
    }
    //if a new place gets selected market color gets yellow
    if (newPlace){
      let newMarker = newPlace.marker;
      newMarker.setIcon(this.mountImage(this.yellowMarker, this.scaledSize));
      newMarker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => newMarker.setAnimation(null), 750);
      this.setState({placeSelected: newPlace});
    } else {
      this.setState({placeSelected: ''});
    }
  }

  //create the marker image
  mountImage(url, size) {
    return {
      url: url,
      scaledSize: size
    };
  }
  /*
    Fetch images from Flickr API
  */
  getImages(place) {
    /*
      Create the flickr URL using the parameters needed to get photos and some infos
      Photos API method => https://www.flickr.com/services/api/flickr.photos.search.html 
    */
    let flickrPhotosRequest = 'https://api.flickr.com/services/rest/?method='+
      'flickr.photos.search&api_key=3ec41c2ca6c30eae649009aa1310d949&format=json&nojsoncallback=1&'+
      '&tags=' + place.tags + '&lat=' + place.lat + '&lon='+ place.lng + '&per_page=8&radius=5&sort=relevance&extras=owner_name';

    let photoData = [];

    //make AJAX call (https://reactjs.org/docs/faq-ajax.html)
    fetch(flickrPhotosRequest)
      .then(res => res.json())
      .then(
        (result) => {
          result.photos.photo.forEach(photo => {
            let farmId = photo.farm;
            let serverId = photo.server;
            let secret = photo.secret;
            let size = 'q';
            let photoId = photo.id;
            let ownername = photo.ownername;

            /*
              Construct the source URL to a photo => Source: https://www.flickr.com/services/api/misc.urls.html
            */
            let url = 'https://farm'+ farmId + '.staticflickr.com/'+
              serverId +'/'+ photoId + '_'+ secret + '_'+ size + '.jpg';

            photoData.push({url: url, ownerName: ownername});
          });
          place.photos = photoData;
          this.setState({placeSelected: place, error: ''});
        },

        /*
          If there's an error on Ajax call, set the error message
        */ 
        (error) => {
          this.setState({error: {message: 'Sorry, the Flickr search API is not currently available!'}})
        }
      );
  }

  /*
    On closing the photos menu, reset the marker
  */
  closePlace() {
    this.switchMarker();
  }

  componentDidMount() {
    window.loadMap = this.loadMap;
  }

  render() {
    return (
      <div>
        <header>
          <nav className="navbar navbar-dark bg-dark ">
            <a className="navbar-brand city-name">Recife Map</a>
            <button className="navbar-toggler" type="button" onClick={this.toggleMenu}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>
        </header>
        <div id="app" className="container-fluid">
          <div className="app-map row">
            {/* Main menu with search input and Recife places*/}
            <div className={!this.state.placeSelected ? (this.state.open ? 'menu col-menu' : 'menu col-menu collapse'): 'hidden'}>
              <div className='input-group'>
                <input type='text' className='form-control' placeholder='Type a place' onChange={this.handleChange} value={this.state.searchValue}/>
                <div className="input-group-append">
                  <button onClick={this.handleChange} className='btn btn-clear btn-outline-secondary' type='button'>x</button>
                </div>
              </div>
              <Menu places={this.state.searchResult}/>
            </div>
            {/* Menu with selected place pictures */}
            <div className={this.state.placeSelected ? (this.state.open ? 'menu col-menu' : 'menu col-menu collapse'): 'hidden'}>
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
            <div id="map" className={this.state.open ? "col-map" : "col-map full"}/>
          </div>
        </div>
      </div>
    );
  }
}
