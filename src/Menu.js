import React from 'react';

import './index.css';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.animateMarker = this.animateMarker.bind(this);
    }

    animateMarker(index) {
        new window.google.maps.event.trigger(this.props.places[index].marker, 'click' );
    }

    render() {
            var placeList = this.props.places.map((place, index) => {
                return (
                    <li className="list-group-item list-group-item-very-dark list-group-item-action" 
                    onClick={this.animateMarker.bind(this, index)} key={index}>
                        {place.name}
                    </li>
                );
            }); 
            return <ul className="list-group">{ placeList }</ul>
        }
};