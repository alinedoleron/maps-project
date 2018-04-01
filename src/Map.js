import React from 'react';

import './index.css';

import Menu from './Menu';

export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      places: [
      {name: 'Shopping Recife', lat: -8.118325, lng: -34.904851, selected: false },
      {name: 'Parraxaxa', lat: -8.1252004, lng:  -34.9029381, selected: false},
      {name: 'Pizza Hut', lat:  -8.1110259, lng: -34.8974302, selected: false },
      {name: 'Tay San', lat: -8.1142982, lng: -34.8999599, selected: false},
      {name: '50 Sabores', lat: -8.1073439, lng: -34.8920895, selected: false}
      ]
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    console.log('Vc digitou: '+ this.state.searchValue);
  }

  handleChange(e) {
    this.setState({searchValue: e.target.value});
  }


  componentDidMount() {
    let boaViagem = {lat: -8.1297506, lng: -34.9091169};
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: boaViagem,
      zoom: 15
    });

    this.state.places.map(function (place) {
      var marker = new window.google.maps.Marker({
        position: {lat: place.lat, lng: place.lng},
        map: map
      });
    });
  }

  

  render() {
    return (
      <div id='app'>
        <div className='menu'>
          <form onSubmit={this.handleClick}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder='Type a place' onChange={this.handleChange} value={this.state.searchValue}/>
              <div className='input-group-append'>
                <input className='input-group-text' id='basic-addon2' type='submit' value='Filter'/>
              </div>
            </div>
          </form>
          <Menu places={this.state.places}/>
        </div>
        <div id='info'></div>
        <div id='map' />
      </div>
    );
  }
};