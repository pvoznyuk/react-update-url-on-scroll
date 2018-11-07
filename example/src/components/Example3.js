import React, { Component } from 'react'
import ScrollableSection, { configureAnchors } from '../../../src'
import Section from './Section'

const sections = [
  {name: '/section1', link: '/section1', exact: true, label: 'Section 1', backgroundColor: 'red'},
  {hash: '#section2', link: '#section2', label: 'Section 2', backgroundColor: 'darkgray'},
  {name: 'section3', link: '/section3', exact: true, label: 'Section 3', backgroundColor: 'green'},
  {name: '/section4', hash: '#surprise',  link:  '/section4#surprise', label: 'Section 4 (with hash)', backgroundColor: 'brown'},
  {name: '/section4', link: '/section4', label: 'Section 4', backgroundColor: 'lightpink'},
]

export default class Example3 extends Component {

  componentWillMount() {
    configureAnchors({offset: 60})
  }

  renderSection = (section) => {
    const props = {...section, sections}
    return (
      <div key={section.id}>
        <ScrollableSection name={section.name || null} hash={section.hash || null} exact={section.exact || false}>
          <Section {...props}/>
        </ScrollableSection>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div style={{marginTop: '60px'}}>
          { sections.map(this.renderSection) }
        </div>
      </div>
    )
  }
}
