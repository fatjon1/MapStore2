/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import Message from '../../I18N/Message';
import BorderLayout from '../../layout/BorderLayout';
import ConfirmModal from '../../maps/modals/ConfirmModal';
import SingleWidgetControls from "./SingleWidgetControls";

/**
 * Base container for widgets.
 * Supports  to display icons, left and right menu, (draggable) header, delete confirm.
 * @prop {string} id of the widget
 * @prop {string} title the title to display in the widget
 * @prop {string} className the class to apply to the main contained object (inside the div `mapstore-widget-card`)
 * @prop {element} icons icons to use as icons
 * @prop {element} topLeftItems items to show at the left of the header
 * @prop {element} topRightItems items to show at the right of the icons
 * @prop {function} toggleDeleteConfirm method triggered on delete confirm
 * @prop {function} onDelete function to call when user confirms delete
 */
export default ({
    id,
    title,
    confirmDelete = false,
    className,
    isDraggable = true,
    toggleDeleteConfirm = () => {},
    onDelete = () => {},
    icons,
    topLeftItems,
    topRightItems,
    headerStyle = {},
    options = {},
    children
}) =>
    (<div className={`mapstore-widget-card ${options.singleWidget  ? 'single-widget' : ''}`} id={id}>
        <BorderLayout className={className} header={(<div style={headerStyle} className={`mapstore-widget-info ${isDraggable ? 'draggableHandle' : ''}`}>
            <div className="mapstore-widget-header">
                <span className="widget-icons">{icons}</span>
                {topLeftItems}
                {
                    options.singleWidget
                        ? <SingleWidgetControls options={options} />
                        : (<span className="widget-title">{title}</span>)
                }
                <span className="mapstore-widget-options">
                    {topRightItems}
                </span>
            </div>
        </div>)}>
            {children}
        </BorderLayout>
        {confirmDelete ? <ConfirmModal
            confirmText={<Message msgId="widgets.widget.menu.delete" />}
            titleText={<Message msgId="widgets.widget.menu.delete" />}
            body={<Message msgId="widgets.widget.menu.confirmDelete" />}
            show={confirmDelete}
            onClose={() => toggleDeleteConfirm(false)}
            onConfirm={() => onDelete(id) }/> : null}
    </div>
    );
