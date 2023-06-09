/**
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/


export const forceSelection = ( {oldValue, changedValue, data, allowEmpty, emptyValue = ""}) => {
    if (allowEmpty && changedValue === "") {
        return emptyValue;
    }
    return data.indexOf(changedValue) !== -1 ? changedValue : oldValue;
};

