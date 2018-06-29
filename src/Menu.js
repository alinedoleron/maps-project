import React from 'react';

import './index.css';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
            var placeList = this.props.places.map(function(place, index){
                return <a href="#" className="list-group-item list-group-item-action" key={ index }>{place.name}</a>;
            }) 
            return   <div className="list-group">{ placeList }</div>
        }
};