import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { goToTop } from '../../../src'
import { ScrollableLink } from '../../../src'

const styles = {
  container: {
    height: '500px',
    padding: '25px 85px',
  },
  label: {
    fontSize: '36px',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    cursor: 'pointer',
  },
}

export default class Section extends Component {

  static propTypes = {
    backgroundColor: PropTypes.string,
    label: PropTypes.string,
    style: PropTypes.object,
    sections: PropTypes.array,
  }

  static defaultProps = {
    backgroundColor: 'white',
    label: 'Section',
    style: {},
    sections: [],
  }

  renderSectionLink = (section) => {
    return (
      <div key={section.id}>
        <ScrollableLink href={ section.link ? section.link : `#${section.id}` }>
          <a style={ styles.link }>{ section.label }</a>
        </ScrollableLink>
      </div>
    )
  }

  render() {
    const {backgroundColor, label, style, sections} = this.props
    const containerStyle = {...style, ...styles.container, backgroundColor}

    return (
      <div style={containerStyle}>
        <div style={styles.label}>
          <span> {label} </span>
        </div>
        { sections.map(this.renderSectionLink) }
        <div style={styles.link} onClick={goToTop}> Top </div>
      </div>
    )
  }
}
