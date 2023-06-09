/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Popover, Glyphicon } from 'react-bootstrap';
import Overlay from '../../misc/Overlay';
import OverlayTrigger from '../../misc/OverlayTrigger';
/**
 * InfoPopover. A component that renders a icon with a Popover.
 * @prop {string} title the title of popover
 * @prop {string} text the text of popover
 * @prop {string} glyph glyph id for the icon
 * @prop {number} left left prop of popover
 * @prop {number} right right prop of popover
 * @prop {string} placement position of popover
 * @prop {object} popoverStyle style for popover wrapper
 * @prop {boolean|String[]} trigger ['hover', 'focus'] by default. false always show the popover. Array with hover, focus and/or click string to specify events that trigger popover to show.
 */
class InfoPopover extends React.Component {

    static propTypes = {
        id: PropTypes.string,
        title: PropTypes.string,
        text: PropTypes.string,
        glyph: PropTypes.string,
        bsStyle: PropTypes.string,
        placement: PropTypes.string,
        left: PropTypes.number,
        top: PropTypes.number,
        trigger: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
        popoverStyle: PropTypes.object
    };

    static defaultProps = {
        id: '',
        title: '',
        text: '',
        placement: 'right',
        left: 200,
        top: 50,
        glyph: "question-sign",
        bsStyle: 'info',
        trigger: ['hover', 'focus']
    };

    renderPopover() {
        return (
            <Popover
                id={this.props.id}
                placement={this.props.placement}
                positionLeft={this.props.left}
                positionTop={this.props.top}
                title={this.props.title}
                style={this.props.popoverStyle}>
                {this.props.text}
            </Popover>
        );
    }
    renderContent() {
        return (<Glyphicon
            ref={button => {
                this.target = button;
            }}
            className={`text-${this.props.bsStyle}`}
            glyph={this.props.glyph} />);
    }
    render() {
        const trigger = this.props.trigger === true ? ['hover', 'focus'] : this.props.trigger;
        return (
            <span className="mapstore-info-popover">
                {this.props.trigger
                    ? (<OverlayTrigger trigger={trigger} placement={this.props.placement} overlay={this.renderPopover()}>
                        {this.renderContent()}
                    </OverlayTrigger>)
                    : [
                        this.renderContent(),
                        <Overlay placement={this.props.placement} show target={() => ReactDOM.findDOMNode(this.target)}>
                            {this.renderPopover()}
                        </Overlay>
                    ]}
            </span>
        );
    }
}

export default InfoPopover;
