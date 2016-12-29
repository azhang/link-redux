/* eslint no-magic-numbers: 0 */
import 'babel-polyfill';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import { describe, it } from 'mocha';
import React from 'react';

import { generateContext, linkedRenderStore } from '../../test/fixtures';
import Type from './Type';

const context = (so) => generateContext({ linkedRenderStore: true, schemaObject: so || true });

describe('Type component', function () {
  it('renders null when type is not present', function() {
    const elem = shallow(
      <Type />,
      context()
    );
    assert.equal(elem.type(), null);
  });

  it('renders no view when no class matches', function () {
    const elem = mount(
      <Type />,
      context({ '@type': 'https://argu.co/ns/core#Challenge' })
    );
    assert(elem.first().hasClass('no-view'));
  });

  it('renders the registered class', function () {
    linkedRenderStore.registerRenderer(a => <div className="thing" />, 'schema:CreativeWork');
    const elem = mount(
      <Type />,
      context({ '@type': 'http://schema.org/CreativeWork' })
    );
    assert(elem.first().hasClass('thing'));
  });
});