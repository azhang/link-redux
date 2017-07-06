import {
  allObjectValues,
  getP,
  getValueOrID,
} from 'link-lib';
import React, { PropTypes } from 'react';

const LANG_PREF = ['nl', 'en', 'de'];

const propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  linkedProp: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

function getPropBestLang(rawProp) {
  if (!Array.isArray(rawProp)) {
    return getValueOrID(rawProp);
  }
  if (rawProp.length === 1) {
    return getValueOrID(rawProp[0]);
  }
  for (let i = 0; i < LANG_PREF.length; i++) {
    const pIndex = rawProp.findIndex(p => getP(p, '@language') === LANG_PREF[i]);
    if (pIndex >= 0) {
      return getValueOrID(getP(rawProp, pIndex));
    }
  }
  return getValueOrID(getP(rawProp, 0));
}

export function expandedProperty(prop, linkedRenderStore) {
  if (Array.isArray(prop)) {
    return prop.map(p => linkedRenderStore.expandProperty(p));
  }
  return linkedRenderStore.expandProperty(prop);
}

export function getLinkedObjectPropertyRaw(property, props, { subject, linkedRenderStore }, term = false) {
  const exProps = expandedProperty(property || props.label, linkedRenderStore);
  if (Array.isArray(exProps)) {
    for (let i = 0; i < exProps.length; i++) {
      const values = allObjectValues(linkedRenderStore.tryEntity(subject), exProps[i], term);
      if (typeof values !== 'undefined') return values;
    }
    return undefined;
  }
  return allObjectValues(linkedRenderStore.tryEntity(subject), exProps, term);
}

export function getLinkedObjectProperty(property, props, context, term = false) {
  if (property === undefined && typeof props.linkedProp !== 'undefined') {
    return props.linkedProp;
  }
  const rawProp = getLinkedObjectPropertyRaw(property, props, context, term);
  if (rawProp === undefined) {
    return undefined;
  }
  const val = getPropBestLang(rawProp);
  if (typeof getValueOrID(val) === 'object') {
    // debugger;
  }

  if (term) return val;
  return val && val.constructor !== Object &&
    (val.href || getValueOrID(val) || val.toString());
}

export const contextTypes = {
  linkedRenderStore: PropTypes.object,
  subject: PropTypes.object,
};

class PropertyBase extends React.Component {
  getLinkedObjectPropertyRaw(property) {
    return getLinkedObjectPropertyRaw(property, this.props, this.context);
  }

  getLinkedObjectProperty(property) {
    return getLinkedObjectProperty(property, this.props, this.context);
  }

  expandedProperty(property) {
    return expandedProperty(property || this.props.label, this.context.linkedRenderStore);
  }

  shouldComponentUpdate(nextProps, Ignore, nextContext) {
    if (nextProps.label === undefined) {
      return false;
    }
    return this.props.label !== nextProps.label ||
      this.props.linkedProp !== nextProps.linkedProp ||
        getLinkedObjectProperty(nextProps.label, this.props, this.context) !==
          getLinkedObjectProperty(nextProps.label, nextProps, nextContext);
  }

  render() {
    return (
      <span>
        PropBase: {this.getLinkedObjectProperty()}
      </span>
    );
  }
}

// export const PropBaseTwo = (props, context) => <Subscriber channel={} {...props} />;

PropertyBase.contextTypes = contextTypes
PropertyBase.propTypes = propTypes;

export default PropertyBase;
