import React, { Component } from 'react'
import ScrollableSection, { configureAnchors } from '../../../src'
import Section from './Section'

const sections = [
  {id: 'section1', link:'#section1', label: 'Section 1', backgroundColor: 'red'},
  {id: 'section2', link:'#section2', label: 'Section 2', backgroundColor: 'darkgray'},
  {id: 'section3', link:'#section3', label: 'Section 3', backgroundColor: 'green'},
  {id: 'section4', link:'#section4', label: 'Section 4', backgroundColor: 'brown'},
  {id: 'section5', link:'#section5', label: 'Section 5', backgroundColor: 'lightpink'},
]

export default class Example1 extends Component {

  componentWillMount() {
    configureAnchors({})
  }

  renderSection = (section) => {
    const props = {...section, sections}

    return (
      <div key={section.id}>
        <ScrollableSection hash={section.id}>
          <Section {...props}/>
        </ScrollableSection>
        <div style={{height: '200px', backgroundColor: 'white'}}/>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div>
          { sections.map(this.renderSection) }
        </div>
      </div>
    )
  }
}
