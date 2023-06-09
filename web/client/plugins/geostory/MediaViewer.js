/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { compose, branch, withProps } from 'recompose';
import find from 'lodash/find';
import includes from 'lodash/includes';
import Image from '../../components/geostory/media/Image';
import Map from '../../components/geostory/media/Map';
import Video from '../../components/geostory/media/Video';
import connectMap, {withLocalMapState, withMapEditingAndLocalMapState} from '../../components/geostory/common/enhancers/map';
import emptyState from '../../components/misc/enhancers/emptyState';
import { resourcesSelector } from '../../selectors/geostory';
import { SectionTypes } from '../../utils/GeoStoryUtils';
import { extractTileMatrixFromSources } from '../../utils/LayersUtils';
import withMediaVisibilityContainer from '../../components/geostory/common/enhancers/withMediaVisibilityContainer';
import autoMapType from '../../components/map/enhancers/autoMapType';
import withScalesDenominators from "../../components/map/enhancers/withScalesDenominators";
import { withCarouselMarkerInteraction } from "../../components/geostory/common/enhancers/withPopupSupport";

const image = branch(
    ({resourceId}) => resourceId,
    compose(
        connect(createSelector(resourcesSelector, (resources) => ({resources}))),
        withProps(
            ({ resources, resourceId: id }) => {
                const resource = find(resources, { id }) || {};
                return resource.data;
            }
        )
    ),
    emptyState(
        ({src = "", sectionType} = {}) => !src && (sectionType !== SectionTypes.TITLE && !includes([SectionTypes.IMMERSIVE, SectionTypes.CAROUSEL], sectionType)),
        () => ({
            glyph: "picture"
        })
    )
)(withMediaVisibilityContainer(Image));

const geostoryMap = compose(
    branch(
        ({ resourceId }) => resourceId,
        connectMap
    ),
    withProps(
        ({ map = {}}) => {
            return {
                map: {
                    ...map,
                    layers: map.layers && map.layers.map(layer => {
                        if (layer.tileMatrixSet && map.sources) {
                            const tileMatrix = extractTileMatrixFromSources(map.sources, layer);
                            return {...layer, ...tileMatrix};
                        }
                        return layer;
                    })
                }
            };
        }
    ),
    autoMapType,
    withScalesDenominators,
    withLocalMapState,
    withMapEditingAndLocalMapState,
    withCarouselMarkerInteraction
)(withMediaVisibilityContainer(Map));

const video = branch(
    ({resourceId}) => resourceId,
    compose(
        connect(createSelector(resourcesSelector, (resources) => ({resources}))),
        withProps(
            ({ resources, resourceId: id, autoplay }) => {
                const resource = find(resources, { id }) || {};
                const { autoplay: resourceAutoplay, ...resourceData } = resource.data || {};
                return {
                    ...resourceData,
                    // prioritize autoplay of content
                    // instead of one from resource
                    autoplay: autoplay !== undefined
                        ? autoplay
                        : resourceAutoplay
                };
            }
        )
    ),
    emptyState(
        ({src = "", sectionType} = {}) => !src && (sectionType !== SectionTypes.TITLE && !includes([SectionTypes.IMMERSIVE, SectionTypes.CAROUSEL], sectionType)),
        () => ({
            glyph: "play"
        })
    )
)(withMediaVisibilityContainer(Video));

const mediaTypesMap = {
    image,
    map: geostoryMap,
    video
};

const MediaViewer = ({ type, ...props }) => {
    const Media = mediaTypesMap[type];
    if (!Media) {
        return null;
    }
    return <Media type={type} { ...props }/>;
};

export default MediaViewer;
