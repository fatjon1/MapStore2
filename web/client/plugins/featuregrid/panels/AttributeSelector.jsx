
import { connect } from 'react-redux';
import AttributeSelector from '../../../components/data/featuregrid/AttributeSelector';
import { getCustomizedAttributes, selectedLayerFieldsSelector } from '../../../selectors/featuregrid';
import { customizeAttribute } from '../../../actions/featuregrid';

export default connect((state) => ({
    attributes: getCustomizedAttributes(state),
    fields: selectedLayerFieldsSelector(state)
}), {
    onChange: (name, value) => customizeAttribute(name, "hide", value)
}
)(AttributeSelector);
