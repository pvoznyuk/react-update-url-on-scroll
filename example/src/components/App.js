import React, { Component } from 'react'
import { Route, Link, Switch } from 'react-router-dom';
import Example1 from './Example1'
import Example2 from './Example2'
import Example3 from './Example3'
import Example4 from './Example4'
import ScrollableSection, { goToTop, goToAnchor } from '../../../src'

const examples = [
  {id: 'hashes', label: 'Hashes', component: Example1},
  {id: 'pathnames', label: 'Pathnames', component: Example2},
  {id: 'mixed', label: 'Mixed', component: Example3},
  {id: 'nested', label: 'Nested', component: Example4},
]

const styles = {
  header: {
    zIndex: 1,
    backgroundColor: 'rgb(235, 235, 235)',
    height: '60px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 85px',
  },
  fixed: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
  },
  headerToggle: {
    marginRight: '15px',
    cursor: 'pointer',
  },
  exampleToggles: {
    display: 'flex',
    flexDirection: 'row',
  },
  sectionNav: {
    display: 'flex',
    flexDirection: 'row',
  },
  singleSectionNav: {
    marginLeft: '15px',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
  },
  selectedToggle: {
    backgroundColor: 'black',
    color: 'white',
  }
}

export default class App extends Component {
  renderExampleToggle = (example, index) => {
    let toggleStyle = styles.headerToggle

    return (
      <div key={example.id} style={toggleStyle} >
        <Link to={`/${example.id}`}>{example.label}</Link>
      </div>
    )
  }

  render() {
    const headerStyle = styles.header

    return (
      <div>
        <div style={headerStyle}>
          <div style={styles.exampleToggles}>
            { examples.map(this.renderExampleToggle) }
          </div>
        </div>

        <Switch>
          <Route exact path="/" component={Example1} />
          <Route exact path="/hashes" component={Example1} />
          <Route exact path="/pathnames" component={Example2} />
          <Route exact path="/pathnames/:section" component={Example2} />
          <Route exact path="/mixed" component={Example3} />
          <Route exact path="/mixed/:section" component={Example3} />
          <Route exact path="/nested" component={Example4} />
          <Route exact path="/nested/:section" component={Example4} />
        </Switch>

      </div>
    )
  }
}
