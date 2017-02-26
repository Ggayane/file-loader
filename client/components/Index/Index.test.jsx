jest.dontMock('./Index.jsx')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

var FileLoader = require('./file-loader/loader.jsx').default

describe('IndexComponent', () => {
  it('should render fileloader', () => {
    var file = null
    var componentInstance = TestUtils.renderIntoDocument(<FileLoader />)

    expect(componentInstance.type).toBe('div')
  })
})
