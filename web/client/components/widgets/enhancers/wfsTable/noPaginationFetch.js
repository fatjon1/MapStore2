/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Get data all in one request.
 * @param {Observable} props$ stream of props
 */
import Rx from 'rxjs';

import { getLayerJSONFeature } from '../../../../observables/wfs';
import { getAttributesNames } from "../../../../utils/FeatureGridUtils";

export default props$ => props$.switchMap(
    ({
        layer = {},
        options = {},
        filter,
        onLoad = () => { },
        onLoadError = () => { }
    }) =>
        getLayerJSONFeature(layer, filter, {
            timeout: 15000,
            params: { propertyName: getAttributesNames(options.propertyName), viewParams: options.viewParams }
            // TODO totalFeatures
            // TODO sortOptions - default
        })
            .map(() => ({
                loading: false,
                error: undefined

            })).do(data => onLoad({
                features: data.features,
                pagination: {
                    totalFeatures: data.totalFeatures
                }
            }))
            .catch((e) => Rx.Observable.of({
                loading: false,
                error: e,
                data: []
            }).do(onLoadError))
);
