/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MockAdapter from "axios-mock-adapter";
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import { createSink, setObservableConfig } from 'recompose';

import axios from "../../../../../libs/ajax";
import wfsTable from '../index';

import rxjsConfig from 'recompose/rxjsObservableConfig';
setObservableConfig(rxjsConfig);
let mockAxios;

const DATA = {
    DESCRIBE: require("../../../../../test-resources/wfs/describe-pois.json"),
    WFS: require("../../../../../test-resources/wfs/museam.json")
};

describe('wfsTable enhancer', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        mockAxios = new MockAdapter(axios);
        mockAxios.onGet(/DESCRIBE.*/).reply(200, DATA.DESCRIBE);
        mockAxios.onPost(/WFS.*/).reply(200, DATA.WFS);
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        mockAxios.restore();
        setTimeout(done);
    });
    it('retrieve WFS describeFeatureType and features', (done) => {

        const Sink = wfsTable(createSink(props => {
            expect(props).toExist();
            if (props.describeFeatureType) {
                expect(props.describeFeatureType.featureTypes).toExist();
            }
            if (props.features && props.features.length > 0) {
                expect(props.features.length > 0).toBe(true);
                done();
            }
        }));
        ReactDOM.render(<Sink layer={{
            name: "pois",
            describeFeatureTypeURL: "DESCRIBE",
            search: {
                type: "wfs",
                url: "WFS"
            }
        }} />, document.getElementById("container"));
    });
    it('retrieve WFS describeFeatureType with virtualScroll', (done) => {
        let triggered = false;
        const Sink = wfsTable(createSink(props => {
            expect(props).toExist();
            if (props.describeFeatureType) {
                expect(props.describeFeatureType.featureTypes).toExist();
            }
            if (props.pages && props.features.length > 0 && props.pages[0] === 0 && !triggered) {
                expect(props.pages[1]).toBe(20);
                triggered = true;
                props.pageEvents.moreFeatures({ startPage: 2, endPage: 3 });
            } else if (props.pages && props.features.length > 0 && props.pages[0] === 40) {
                expect(props.pages[1]).toBe(60);
                done();
            }
        }));
        ReactDOM.render(<Sink virtualScroll layer={{
            name: "pois",
            describeFeatureTypeURL: "DESCRIBE",
            search: {
                type: "wfs",
                url: "WFS"
            }
        }} />, document.getElementById("container"));
    });
    it('test columnsettings with options propertyName', (done) => {
        let triggered = false;
        const Sink = wfsTable(createSink(props => {
            expect(props).toExist();
            if (props.features.length > 0 && props?.pages?.[0] === 0 && !triggered) {
                expect(props.pages[1]).toBe(20);
                triggered = true;
                props.pageEvents.moreFeatures({ startPage: 2, endPage: 3 });
            } else if (props.features.length > 0 && props?.pages?.[0] === 40) {
                expect(props.pages[1]).toBe(60);
                done();
            }
            if (props.columnSettings) {
                expect(Object.keys(props.columnSettings).includes('NAME')).toBeFalsy();
            }
        }));
        ReactDOM.render(<Sink virtualScroll
            describeFeatureType = {{
                featureTypes: [{properties: []}]
            }}
            options={{propertyName: [{name: "NAME"}]}}
            layer={{
                name: "pois",
                describeFeatureTypeURL: "DESCRIBE",
                search: {
                    type: "wfs",
                    url: "WFS"
                }
            }} />, document.getElementById("container"));
    });
});
