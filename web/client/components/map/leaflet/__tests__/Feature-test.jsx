/**
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Feature from '../Feature';
import expect from 'expect';

const container = {
    addLayer: () => {},
    removeLayer: () => {},
    _msLegacyGeoJSON: true
};

describe('leaflet Feature component', () => {

    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test LineString style', () => {
        const geometry = {
            type: 'LineString',
            coordinates: [
                [100.0, 0.0], [101.0, 1.0]
            ]
        };
        const type = 'Feature';
        let lineString = ReactDOM.render(<Feature
            type={type}
            container={container}
            geometry={geometry}/>, document.getElementById("container"));

        expect(lineString._layers).toExist();
        expect(lineString._layers[0]).toExist();
        expect({...lineString._layers[0].options}).toEqual({highlight: undefined});

        const style = {
            color: '#3388ff',
            weight: 4
        };

        lineString = ReactDOM.render(<Feature
            type={type}
            container={container}
            style={style}
            geometry={geometry}/>, document.getElementById("container"));
        setTimeout(() => {
            expect(lineString._layers).toExist();
            expect(lineString._layers[0]).toExist();
            expect({...lineString._layers[0].options}).toEqual({...style});
        }, 0);

    });


    it('test MultiLineString style', () => {
        const geometry = {
            type: 'MultiLineString',
            coordinates: [
                [ [100.0, 0.0], [101.0, 1.0] ],
                [ [102.0, 2.0], [103.0, 3.0] ]
            ]
        };
        const type = 'Feature';
        let multiLineString = ReactDOM.render(<Feature
            type={type}
            container={container}
            geometry={geometry}/>, document.getElementById("container"));

        expect(multiLineString._layers).toExist();
        expect(multiLineString._layers[0]).toExist();

        let layersKeys = Object.keys(multiLineString._layers[0]._layers);
        let firstLayer = multiLineString._layers[0]._layers[layersKeys[0]];
        expect({...firstLayer.options}).toEqual({highlight: undefined});

        const style = {
            color: '#3388ff',
            weight: 4
        };
        multiLineString = ReactDOM.render(<Feature
            type={type}
            container={container}
            style={style}
            geometry={geometry}/>, document.getElementById("container"));

        setTimeout(() => {
            expect(multiLineString._layers).toExist();
            expect(multiLineString._layers[0]).toExist();
            layersKeys = Object.keys(multiLineString._layers[0]._layers);
            firstLayer = multiLineString._layers[0]._layers[layersKeys[0]];
            expect({...firstLayer.options}).toEqual({...style});
        }, 0);
    });

    it('test Polygon style', () => {
        const geometry = {
            type: 'Polygon',
            coordinates: [
                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
            ]
        };

        const type = 'Feature';
        let polygon = ReactDOM.render(<Feature
            type={type}
            container={container}
            geometry={geometry}/>, document.getElementById("container"));

        expect(polygon._layers).toExist();
        expect(polygon._layers[0]).toExist();
        expect({...polygon._layers[0].options}).toEqual({highlight: undefined});

        const style = {
            color: '#3388ff',
            weight: 4,
            dashArray: '',
            fillColor: 'rgba(51, 136, 255, 0.2)'
        };

        polygon = ReactDOM.render(<Feature
            type={type}
            container={container}
            style={style}
            geometry={geometry}/>, document.getElementById("container"));

        setTimeout(() => {
            expect(polygon._layers).toExist();
            expect(polygon._layers[0]).toExist();
            expect({...polygon._layers[0].options}).toEqual({...style});
        }, 0);

    });

    it('test MultiPolygon style', () => {
        const geometry = {
            type: 'MultiPolygon',
            coordinates: [
                [
                    [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
                ],
                [
                    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
                    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
                ]
            ]
        };

        const type = 'Feature';
        let multiPolygon = ReactDOM.render(<Feature
            type={type}
            container={container}
            geometry={geometry}/>, document.getElementById("container"));

        expect(multiPolygon._layers).toExist();
        expect(multiPolygon._layers[0]).toExist();

        let layersKeys = Object.keys(multiPolygon._layers[0]._layers);
        let firstLayer = multiPolygon._layers[0]._layers[layersKeys[0]];
        expect({...firstLayer.options}).toEqual({highlight: undefined});

        const style = {
            color: '#3388ff',
            weight: 4,
            dashArray: '',
            fillColor: 'rgba(51, 136, 255, 0.2)'
        };

        multiPolygon = ReactDOM.render(<Feature
            type={type}
            container={container}
            style={style}
            geometry={geometry}/>, document.getElementById("container"));

        setTimeout(() => {
            expect(multiPolygon._layers).toExist();
            expect(multiPolygon._layers[0]).toExist();
            layersKeys = Object.keys(multiPolygon._layers[0]._layers);
            firstLayer = multiPolygon._layers[0]._layers[layersKeys[0]];
            expect({...firstLayer.options}).toEqual({...style});
        }, 0);


    });

    it('test FeatureCollection style', () => {
        const geometry1 = {
            type: 'LineString',
            coordinates: [
                [100.0, 0.0], [101.0, 1.0]
            ]
        };
        const geometry2 = {
            type: 'LineString',
            coordinates: [
                [200.0, 0.0], [201.0, 1.0]
            ]
        };

        const features = [{
            type: 'Feature',
            geometry: geometry1
        }, {
            type: 'Feature',
            geometry: geometry2
        }];
        const type = 'FeatureCollection';
        let collection = ReactDOM.render(<Feature
            type={type}
            container={container}
            features={features} />, document.getElementById("container"));

        expect(collection._layers).toExist();
        expect(collection._layers.length).toBe(2);
        expect({ ...collection._layers[0].options }).toEqual({ highlight: undefined });

        const style = {
            color: '#3388ff',
            weight: 4
        };

        collection = ReactDOM.render(<Feature
            type={type}
            container={container}
            style={style}
            features={features} />, document.getElementById("container"));
        setTimeout(() => {
            expect(collection._layers).toExist();
            expect(collection._layers.length).toBe(2);
            expect({ ...collection._layers[0].options }).toEqual({ ...style });
            expect({ ...collection._layers[1].options }).toEqual({ ...style });
        }, 0);

    });

    it('test onClick feature', () => {
        const actions = {
            handler: () => { }
        };
        var spyOnClick = expect.spyOn(actions, 'handler');
        const geometry = {
            type: 'Point',
            coordinates: [-90, 40]
        };
        const type = 'Feature';
        let point = ReactDOM.render(<Feature
            type={type}
            container={container}
            onClick={actions.handler}
            options={{id: "markerFt"}}
            geometry={geometry}/>, document.getElementById("container"));
        expect(point._layers).toExist();
        expect(point._layers[0]).toExist();
        point._layers[0].fire('click', {
            type: 'click',
            latlng: {lat: 10, lng: 43},
            originalEvent: {
                x: 100, y: 435
            }
        });
        expect(spyOnClick).toHaveBeenCalled();
        const [{arguments: results}] = spyOnClick.calls || [];
        expect(results).toBeTruthy();
        expect(results[0].pixel).toEqual({x: 100, y: 435});
        expect(results[0].latlng).toEqual({lat: 10, lng: 43});
        expect(results[0].rawPos).toEqual([10, 43]);
    });

    it('test onClick with handleClickOnLayer', () => {
        const actions = {
            handler: () => { }
        };
        var spyOnClick = expect.spyOn(actions, 'handler');
        const geometry = {
            type: 'Point',
            coordinates: [-90, 40]
        };
        const type = 'Feature';
        let point = ReactDOM.render(<Feature
            type={type}
            container={container}
            onClick={actions.handler}
            options={{handleClickOnLayer: true, id: "markerFt"}}
            geometry={geometry}/>, document.getElementById("container"));
        expect(point._layers).toExist();
        expect(point._layers[0]).toExist();
        point._layers[0]._map = {
            mouseEventToLatLng: ()=> ({lat: 11, lng: 45})
        };
        point._layers[0].fire('click', {
            type: 'click',
            latlng: {lat: 10, lng: 43},
            originalEvent: {
                x: 100, y: 435
            }
        });
        expect(spyOnClick).toHaveBeenCalled();
        const [{arguments: results}] = spyOnClick.calls || [];
        expect(results).toBeTruthy();
        expect(results[0].pixel).toEqual({x: 100, y: 435});
        expect(results[0].latlng).toEqual({"lat": 10, "lng": 43});
        expect(results[0].rawPos).toEqual([11, 45]);
        expect(results[1]).toBe("markerFt");
    });
});
