/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import url from 'url';

import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import BorderLayout from '../../components/layout/BorderLayout';
import Page from '../../containers/Page';

const urlQuery = url.parse(window.location.href, true).query;

/**
  * @name Importer
  * @memberof pages
  * @class
  * @classdesc
  * Importer allow a user with admin permissions to import data in GeoServer.
  *
  * Requirements:
  *
  * - This page have to be configured in appConfig `pages`. this way
  * ```javascript
  *    pages: [
  *    //...
  *    {
  *      name: "importer",
  *      path: "/importer",
  *      component: require('path_to_/pages/Importer')
  *    }]
  * ```
  * - `localConfig.json` must include an 'importer' entry in the plugins
  *
  * Then this page will be available at http://localhos:8081/#/importer
  *
  * @example
  * // localConfig configuration example
  * "plugins": {
  *  "importer": [
  *         // ...
  *         {
  *             "name": "Importer",
  *            "cfg": {} // see plugin configuration
  *         }
  *     ]
  * }
*/

class ImporterPage extends React.Component {
    static propTypes = {
        mode: PropTypes.string,
        match: PropTypes.object,
        plugins: PropTypes.object,
        loaderComponent: PropTypes.func
    };

    static defaultProps = {
        name: "importer",
        mode: 'desktop'
    };

    render() {
        return (<Page
            component={BorderLayout}
            className="importer-page"
            id="importer"
            includeCommon={false}
            plugins={this.props.plugins}
            params={this.props.match.params}
            loaderComponent={this.props.loaderComponent}
        />);
    }
}

export default connect((state) => ({
    mode: urlQuery.mobile || state.browser && state.browser.mobile ? 'mobile' : 'desktop'
}))(ImporterPage);
