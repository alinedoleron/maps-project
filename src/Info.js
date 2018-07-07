import React from 'react';

import './index.css';

export default class Info extends React.Component {
    render() {
        let placeSelected = this.props.placeSelected;

        let photos = [];

        if(placeSelected.photos) {
            photos = placeSelected.photos.map((photoData, index) => {
                return (
                    <div className="card-sm" key={index}>
                        <img className="card-img-top" src={photoData.url} alt={photoData.url}/>
                        <div className="card-body">
                            <p className="card-text">Créditos: {photoData.ownerName}</p>
                        </div>
                    </div>
                );
            });
        }

        return (
            <div className="cards-area">
                { photos }
            </div>
        )
    }
}