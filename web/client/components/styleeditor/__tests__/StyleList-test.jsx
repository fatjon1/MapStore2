/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ReactDOM from 'react-dom';
import StyleList from '../StyleList';
import TestUtils from 'react-dom/test-utils';
import expect from 'expect';

describe('test StyleList module component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('test StyleList show list', () => {

        ReactDOM.render(<StyleList
            defaultStyle="point"
            enabledStyle="square"
            availableStyles={
                [
                    {
                        name: 'point',
                        filename: 'default_point.sld',
                        format: 'sld',
                        title: 'A boring default style',
                        _abstract: 'A sample style that just prints out a purple square'
                    },
                    {
                        name: 'square',
                        filename: 'square.css',
                        format: 'css',
                        title: 'Square',
                        _abstract: 'Simple square'
                    },
                    {
                        name: 'css',
                        filename: 'circle.css',
                        format: 'css',
                        title: 'Circle',
                        _abstract: 'Simple circle'
                    }
                ]
            }/>, document.getElementById("container"));

        const cards = document.querySelectorAll('.mapstore-side-card');
        expect(cards.length).toBe(3);

        const selectedTitle = document.querySelector('.mapstore-side-card.selected .mapstore-side-card-title span');
        expect(selectedTitle.innerHTML).toBe('Square');

        const svgIconsText = document.querySelectorAll('svg text');
        expect(svgIconsText.length).toBe(3);

        expect(svgIconsText[0].innerHTML).toBe('SLD');
        expect(svgIconsText[1].innerHTML).toBe('CSS');
        expect(svgIconsText[2].innerHTML).toBe('CSS');
    });

    it('test StyleList onSelect', () => {

        const testHandlers = {
            onSelect: () => {}
        };

        const spyOnSelect = expect.spyOn(testHandlers, 'onSelect');

        ReactDOM.render(<StyleList
            defaultStyle="point"
            enabledStyle="square"
            onSelect={testHandlers.onSelect}
            availableStyles={
                [
                    {
                        name: 'point',
                        filename: 'default_point.sld',
                        format: 'sld',
                        title: 'A boring default style',
                        _abstract: 'A sample style that just prints out a purple square'
                    },
                    {
                        name: 'square',
                        filename: 'square.css',
                        format: 'css',
                        title: 'Square',
                        _abstract: 'Simple square'
                    },
                    {
                        name: 'circle',
                        filename: 'circle.css',
                        format: 'css',
                        title: 'Circle',
                        _abstract: 'Simple circle'
                    }
                ]
            }/>, document.getElementById("container"));

        const cards = document.querySelectorAll('.mapstore-side-card');
        expect(cards.length).toBe(3);

        TestUtils.Simulate.click(cards[2]);

        expect(spyOnSelect).toHaveBeenCalledWith({style: 'circle'}, true);
    });

    it('test StyleList onSelect default', () => {

        const testHandlers = {
            onSelect: () => {}
        };

        const spyOnSelect = expect.spyOn(testHandlers, 'onSelect');

        ReactDOM.render(<StyleList
            defaultStyle="point"
            enabledStyle="square"
            onSelect={testHandlers.onSelect}
            availableStyles={
                [
                    {
                        name: 'point',
                        filename: 'default_point.sld',
                        format: 'sld',
                        title: 'A boring default style',
                        _abstract: 'A sample style that just prints out a purple square'
                    },
                    {
                        name: 'square',
                        filename: 'square.css',
                        format: 'css',
                        title: 'Square',
                        _abstract: 'Simple square'
                    },
                    {
                        name: 'circle',
                        filename: 'circle.css',
                        format: 'css',
                        title: 'Circle',
                        _abstract: 'Simple circle'
                    }
                ]
            }/>, document.getElementById("container"));

        const cards = document.querySelectorAll('.mapstore-side-card');
        expect(cards.length).toBe(3);

        TestUtils.Simulate.click(cards[0]);

        expect(spyOnSelect).toHaveBeenCalledWith({ style: 'point' }, true);
    });


    it('test StyleList showDefaultStyleIcon', () => {

        ReactDOM.render(<StyleList
            defaultStyle="point"
            enabledStyle="square"
            showDefaultStyleIcon
            availableStyles={
                [
                    {
                        name: 'point',
                        filename: 'default_point.sld',
                        format: 'sld',
                        title: 'A boring default style',
                        _abstract: 'A sample style that just prints out a purple square'
                    },
                    {
                        name: 'square',
                        filename: 'square.css',
                        format: 'css',
                        title: 'Square',
                        _abstract: 'Simple square'
                    },
                    {
                        name: 'circle',
                        filename: 'circle.css',
                        format: 'css',
                        title: 'Circle',
                        _abstract: 'Simple circle'
                    }
                ]
            }/>, document.getElementById("container"));
        const cards = document.querySelectorAll('.mapstore-side-card');
        expect(cards.length).toBe(3);

        const iconDefault = cards[0].querySelectorAll('.glyphicon');
        expect(iconDefault.length).toBe(1);

        const icon1 = cards[1].querySelectorAll('.glyphicon');
        expect(icon1.length).toBe(0);

        const icon2 = cards[1].querySelectorAll('.glyphicon');
        expect(icon2.length).toBe(0);
    });

    it('test styleList onFilter', () => {

        ReactDOM.render(<StyleList
            filterText="point"
            defaultStyle="point"
            enabledStyle="square"
            showDefaultStyleIcon
            availableStyles={
                [
                    {
                        name: 'point',
                        filename: 'default_point.sld',
                        format: 'sld',
                        title: 'A boring default style',
                        _abstract: 'A sample style that just prints out a purple square'
                    },
                    {
                        name: 'points',
                        filename: 'default_point.sld',
                        format: 'css',
                        title: 'A cool style',
                        _abstract: 'simple and cool'
                    },
                    {
                        name: 'square',
                        filename: 'square.css',
                        format: 'css',
                        title: 'Square',
                        _abstract: 'Simple square'
                    },
                    {
                        name: 'circle',
                        filename: 'circle.css',
                        format: 'css',
                        title: 'Circle',
                        _abstract: 'Simple circle'
                    }
                ]
            }/>, document.getElementById("container"));
        const cards = document.querySelectorAll('.mapstore-side-card');
        expect(cards.length).toBe(2);
    });

    it('test styleList onFilter for metadata', () => {

        ReactDOM.render(<StyleList
            filterText="main"
            defaultStyle="point"
            enabledStyle="square"
            showDefaultStyleIcon
            availableStyles={
                [
                    {
                        name: 'point',
                        filename: 'default_point.sld',
                        format: 'sld',
                        title: 'A boring default style',
                        _abstract: 'A sample style that just prints out a purple square',
                        metadata: {
                            title: 'main style',
                            describe: 'It can control the layout of multiple web pages all at once.'
                        }
                    },
                    {
                        name: 'points',
                        filename: 'default_point.sld',
                        format: 'css',
                        title: 'A cool style',
                        _abstract: 'simple and cool',
                        metadata: {
                            title: 'alternative styles',
                            describe: 'Used to apply a unique style to a single HTML element.'
                        }
                    }
                ]
            }/>, document.getElementById("container"));
        const cards = document.querySelectorAll('.mapstore-side-card');
        expect(cards.length).toBe(1);
    });
});
