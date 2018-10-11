import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App__header">
          <div className="App__navigation">
            <nav className="App__navigation-list">
              <a className="App__navigation-list-item">about</a>
              <a className="App__navigation-list-item">projects</a>
              <a className="App__navigation-list-item">next</a>
              <a className="App__navigation-list-item">contact me</a>
            </nav>
            <div className="App__logo">
              <span className="App__logo_main">Arnie’s </span> showcase
            </div>
          </div>
          <div className="App__welcome">
            Arnie. <span className="App__welcome_highlight">Make frontend.</span> Love UX.
          </div>
        </header>
        <section className="App__section">
          <h1 className="App__quote">Making Frontend <br/> Great Again</h1>
          <div className="App__call-to-action">
            <button className="App__call-to-action__button">Get my CV</button>
            <div className='App__call-to-action__notice'>For your old-school recruitment specialist</div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
