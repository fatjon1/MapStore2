/*
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */
import React from 'react';
import {Col, ControlLabel, Form, FormControl, FormGroup, Row} from 'react-bootstrap';

import Message from '../../../../I18N/Message';
import StepHeader from '../../../../misc/wizard/StepHeader';

export default ({data = {}, onChange = () => {}, sampleChart, showTitle = true}) => (<Row>
    {showTitle && <StepHeader title={<Message msgId={`widgets.widgetOptionsTitle`} />} />}
    <Col key="sample" xs={12}>
        <div style={{marginBottom: "30px"}}>
            {sampleChart}
        </div>
    </Col>
    <Col key="form" xs={12}>
        <Form className="widget-options-form" horizontal>
            <FormGroup controlId="groupByAttributes">
                <Col componentClass={ControlLabel} sm={6}>
                    <Message msgId={`widgets.title`} />
                </Col>
                <Col sm={6}>
                    <FormControl value={data.title} type="text" onChange={ e => onChange("title", e.target.value)} />
                </Col>
            </FormGroup>
            <FormGroup controlId="aggregationAttribute">
                <Col componentClass={ControlLabel} sm={6}>
                    <Message msgId={`widgets.description`} />
                </Col>
                <Col sm={6}>
                    <FormControl value={data.description} type="text" onChange={ e => onChange("description", e.target.value)} />
                </Col>
            </FormGroup>
        </Form>
    </Col>
</Row>);
