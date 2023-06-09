/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { updateNode } from './layers';

import WMS from '../api/WMS';
import { getLayerOptions } from '../utils/WMSUtils';
import * as WFS from '../api/WFS';
import WCS from '../api/WCS';
import {getCapabilitiesUrl} from '../utils/LayersUtils';
import { get } from 'lodash';
import { extractGeometryType } from '../utils/WFSLayerUtils';

export function getDescribeLayer(url, layer, options) {
    return (dispatch /* , getState */) => {
        return WMS.describeLayer(url, layer.name, options).then((describeLayer) => {
            if (describeLayer && describeLayer.owsType === "WFS") {
                return WFS.describeFeatureType(url, describeLayer.name)
                    .then( (describeFeatureType) => {
                        describeLayer.geometryType = extractGeometryType(describeFeatureType);
                        return dispatch(updateNode(layer.id, "id", { describeLayer, describeFeatureType }));
                    })
                    .catch(() => {
                        return dispatch(updateNode(layer.id, "id", { describeLayer: describeLayer || { "error": "no describe feature found" }}));
                    });
            } else if ( describeLayer && describeLayer.owsType === "WCS" ) {
                WCS.describeCoverage(url, describeLayer.name).then((describeCoverage) => {
                    // TODO move the management of this bands in the proper components, getting the describeFeatureType entry:
                    let axis = get(describeCoverage, "wcs:CoverageDescriptions.wcs:CoverageDescription.wcs:Range.wcs:Field.wcs:Axis.wcs:AvailableKeys.wcs:Key");
                    if (axis && typeof axis === "string") {
                        describeLayer.bands = [1 + ""];
                    } else {
                        describeLayer.bands = axis.map((el, index) => index + 1 + ""); // array of 1 2 3 because the sld do not recognize the name
                    }

                    dispatch(updateNode(layer.id, "id", {describeLayer, describeCoverage}));
                }).catch(() => {
                    return dispatch(updateNode(layer.id, "id", {describeLayer: describeLayer || {"error": "no describe coverage found"}}));
                });
            }
            return dispatch(updateNode(layer.id, "id", {describeLayer: describeLayer || {"error": "no describe Layer found"}}));

        })
            .catch((error) => {
                return dispatch(updateNode(layer.id, "id", {describeLayer: {"error": error.status}}));
            });
    };
}

export function getLayerCapabilities(layer) {
    // geoserver's specific. TODO parse layer.capabilitiesURL.
    const reqUrl = getCapabilitiesUrl(layer);
    return (dispatch) => {
        // TODO, look ad current cached capabilities;
        dispatch(updateNode(layer.id, "id", {
            capabilitiesLoading: true
        }));
        return WMS.getCapabilities(reqUrl).then((capabilities) => {
            const layerCapability = WMS.parseLayerCapabilities(capabilities, layer);

            if (layerCapability) {
                dispatch(updateNode(layer.id, "id", { ...getLayerOptions(layerCapability), capabilitiesLoading: null }));
            } else {
                dispatch(updateNode(layer.id, "id", { capabilitiesLoading: null, capabilities: { error: "error getting capabilities", details: "no layer info" }, description: null }));
            }
            // return dispatch(updateNode(layer.id, "id", {capabilities: capabilities || {"error": "no describe Layer found"}}));

        }).catch((error) => {
            dispatch(updateNode(layer.id, "id", {capabilitiesLoading: null, capabilities: {error: "error getting capabilities", details: error}, description: null} ));

            // return dispatch(updateNode(layer.id, "id", {capabilities: capabilities || {"error": "no describe Layer found"}}));

        });
    };
}
