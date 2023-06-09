/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose, withPropsOnChange } from 'recompose';

import { find, isEmpty, isEqual } from 'lodash';
import { composeAttributeFilters, toCQLFilter } from '../../../utils/FilterUtils';
import { optionsToVendorParams } from '../../../utils/VendorParamsUtils';
import { arrayUpdate } from '../../../utils/ImmutableUtils';
import { composeFilterObject } from './utils';

/**
 * Merges dependencies quickFilters and filter into a cql filter for a layer
 * @returns {object} the map with layers updated or not
 */
export default compose(
    withPropsOnChange(
        ({mapSync, dependencies = {}, maps = [], selectedMapId } = {}, nextProps = {}, filter) =>
            mapSync !== nextProps.mapSync
            || !isEqual(dependencies, nextProps.dependencies)
            || !isEqual(maps, nextProps.maps)
            || filter !== nextProps.filter
            || selectedMapId !== nextProps.selectedMapId,
        ({ mapSync, dependencies = {}, filter: filterObj = {}, maps = [], selectedMapId} = {}) => {

            const targetLayerName = dependencies && dependencies.layer && dependencies.layer.name;
            const map = find(maps, (m) => m.mapId === selectedMapId);
            if (map) {
                const layerInCommon = find(map?.layers, {name: targetLayerName}) || {};

                let filterObjCollection = {};
                let layersUpdatedWithCql = {};
                let cqlFilter = undefined;

                if (mapSync && !isEmpty(layerInCommon)) {
                    if (dependencies.quickFilters) {
                        filterObjCollection = {...filterObjCollection, ...composeFilterObject(filterObj, dependencies.quickFilters, dependencies.options)};
                    }
                    if (dependencies.filter) {
                        filterObjCollection = {...filterObjCollection, ...composeAttributeFilters([filterObjCollection, dependencies.filter])};
                    }
                    if (!isEmpty(filterObjCollection) && toCQLFilter(filterObjCollection)) {
                        cqlFilter = toCQLFilter(filterObjCollection);
                        layersUpdatedWithCql = arrayUpdate(
                            false,
                            {
                                ...layerInCommon,
                                params: optionsToVendorParams({ params: {CQL_FILTER: cqlFilter}}, layerInCommon && layerInCommon.params && layerInCommon.params.CQL_FILTER)
                            },
                            {name: targetLayerName},
                            map.layers
                        );
                        return {
                            maps: arrayUpdate(false, {
                                ...map,
                                layers: layersUpdatedWithCql
                            }, {mapId: selectedMapId},  maps)
                        };
                    }
                }
                layersUpdatedWithCql = map.layers.map(l => ({...l, params: {...l.params, CQL_FILTER: undefined}}));
                return {
                    maps: arrayUpdate(false, {
                        ...map,
                        layers: layersUpdatedWithCql
                    }, {mapId: selectedMapId},  maps)
                };
            }
            return { maps };
        }
    )

);
