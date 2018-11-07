import React, { Component } from 'react'
import ScrollableSection, { configureAnchors } from '../../../src'
import Section from './Section'

const sections = [
  {id: 'section1', link:'/section1', label: 'Section 1', backgroundColor: 'red'},
  {id: 'section2', link:'/section2', label: 'Section 2', backgroundColor: 'darkgray'},
  {id: 'section3', link:'/section3', label: 'Section 3', backgroundColor: 'green'},
  {id: 'section4', link:'/section4', label: 'Section 4', backgroundColor: 'brown'},
  {id: 'section5', link:'/section5', label: 'Section 5', backgroundColor: 'lightpink'},
]

const styles = {
  centerColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
}

export default class Example4 extends Component {

  componentWillMount() {
    configureAnchors({offset: 60})
  }

  renderSection = (section) => {
    const props = {...section, sections}
    return (
      <div key={section.id}>
        <ScrollableSection name={`${section.id}`}>
          <div style={{...styles.centerColumn, height: '900px'}}>
            <ScrollableSection name={`${section.id}`} hash={`${section.id}outer`}>
              <div style={{...styles.centerColumn, backgroundColor: 'yellow', height: '700px'}}>
                <ScrollableSection name={section.id} hash={`${section.id}inner`}>
                  <Section {...props}/>
                </ScrollableSection>
              </div>
            </ScrollableSection>
          </div>
        </ScrollableSection>
        <div id={`${section.id}classic`} style={{height: '300px', backgroundColor: 'black'}}/>
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
