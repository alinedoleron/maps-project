import React from 'react';

import './index.css';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        console.log('The plases are:' + this.props.places);
    }

    render() {
            var placeList = this.props.places.map(function(place, index){
                return <a href="#" className="list-group-item list-group-item-action" key={ index }>{place.name}</a>;
            }) 
            return   <div className="list-group">{ placeList }</div>
        }
};