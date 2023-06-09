/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const UPDATE_LAYER_DIMENSION_DATA = "DIMENSION:UPDATE_LAYER_DIMENSION_DATA";
export const SET_CURRENT_TIME = "TIME_MANAGER:SET_CURRENT_TIME";
export const SET_OFFSET_TIME = "TIME_MANAGER:SET_OFFSET_TIME";
export const MOVE_TIME = "TIME_MANAGER:MOVE_TIME";

/**
 * @param {string} layerId the layer Identifier
 * @param {string} dimension the dimension name ("time", "elevation"...)
 * @param {object} data Sets the time data for a layer
 */
export const updateLayerDimensionData = (layerId, dimension, data) => ({ type: UPDATE_LAYER_DIMENSION_DATA, dimension, layerId, data });

/**
 * Set the current time state entry
 * @param {string|date} time the current time to set
 */
export const setCurrentTime = time => ({ type: SET_CURRENT_TIME, time });
/**
 * Set the current offset.
 * @param {string|date} offsetTime the current offset time in ISO format. If undefined, the current time is implicit set to single time mode. (against range)
 */
export const setCurrentOffset = offsetTime => ({ type: SET_OFFSET_TIME, offsetTime });
/**
 * Set the current time and shift the current offset to maintain the same interval.
 * @param {string} time the current time to set in ISO format
 */
export const moveTime = time => ({ type: MOVE_TIME, time});

