/**
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { includes, merge } from 'lodash';
import { compose, createEventHandler, defaultProps, withHandlers, withProps, withStateHandlers } from 'recompose';

import { getFeatureTypeProperties } from '../../../../utils/ogc/WFS/base';
import propsStreamFactory from '../../../misc/enhancers/propsStreamFactory';
import describeFetch from './describeFetch';
import noPaginationFetch from './noPaginationFetch';
import triggerFetch from './triggerFetch';
import virtualScrollFetch from './virtualScrollFetch';
import { getAttributesNames } from "../../../../utils/FeatureGridUtils";

const fetchDataStream = (props$, pages$, virtualScroll = true) =>
    triggerFetch(props$)
        .let(virtualScroll
            ? virtualScrollFetch(
                pages$.withLatestFrom(
                    props$
                    // get latest options needed
                        .map(({pagination = {}} = {}) => ({
                            pagination
                        })), // pagination is needed to allow workaround of GEOS-7233
                    (pagesRange, otherOptions) => ({
                        pagesRange,
                        ...otherOptions
                    })
                )
            )
            : noPaginationFetch
        )
        .startWith({});


const dataStreamFactory = ($props) => {
    const {handler, stream: pages$ } = createEventHandler();
    return describeFetch($props)
        .combineLatest(
            fetchDataStream($props, pages$.startWith({startPage: 0, endPage: 1})),
            (p1, p2) => ({
                ...p1,
                ...p2,
                pageEvents: {
                    moreFeatures: handler,
                    onPageChange: () => {}
                }
            })
        )
        .startWith({loading: true});
};

/**
 * Enhancer a FeatureGrid or a TableWidget to connect to WFS services. It's used in a widgets context, but is enough general
 * to be used in any other context. TODO: move it in FeatureGrid enhancers when enough stable and general.
 * of a layer and use virtualScroll.
 * Manages propertyNames to manage columns and support WFS Filters
 * @prop {object} layer. The layer with at least layer name and URL.
 * @prop {boolean} virtualScroll. If enabled, the FeatureGrid will retrieve data with virtualScroll
 * @prop {object} options. Options for WFS. Can contain
 *  - propertyName: an array of property name to optimize download.
 *  - columnSettings: will be merged with grid columnSettings to setup column width and so on
*/
export default compose(
    defaultProps({
        virtualScroll: true,
        size: 20,
        maxStoredPages: 5
    }),
    withStateHandlers({
        pages: [],
        features: [],
        pagination: {}
    }, {
        setData: () => ({pages, features, pagination} = {}) => ({
            pages,
            features,
            pagination,
            error: undefined
        })
    }),
    withHandlers({
        onLoad: ({ setData = () => {}, onLoad = () => {}} = {}) => (...args) => {
            setData(...args);
            onLoad(...args);
        }
    }),
    withProps(() => ({
        dataStreamFactory
    })),
    propsStreamFactory,
    // handle propertyNames and columnOptions
    withProps(({ options = {}, describeFeatureType: dft, columnSettings = {} } = {}) => ({
        columnSettings: merge(
            dft ?
                getFeatureTypeProperties(dft)
                    .filter(p => !includes(getAttributesNames(options.propertyName) || [], p.name))
                    .reduce((acc, p) => ({
                        ...acc,
                        [p.name]: {
                            hide: true
                        }
                    }), {}) : {},
            options.columnSettings || {},
            columnSettings)
    }))
);
