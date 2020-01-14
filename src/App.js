import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Row, Col } from 'reactstrap'

import { SearchPokedex, CardPokedex } from './components'
import { removePokedex } from './Action/myPokedex'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

class App extends Component {
  state = {
    isOpenModal: false
  }

  toggleModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal
    })
  }

  onRemovePokedex = card => () => {
    const { removePokedex } = this.props
    removePokedex(card)
  }

  renderCardPokedex = () => {
    const { myPokedexes } = this.props

    return myPokedexes.map((myPokedex, index) => (
      <Col sm="6" key={index} className="card-row">
        <CardPokedex card={myPokedex} textAction="X" action={this.onRemovePokedex} />
      </Col>
    ))
  }

  render() {
    const { isOpenModal } = this.state

    return (
      <Fragment>
        <div className="App">
          <Row className="header">
            <Col>
              <h2 className=" text-center">My Pokedex</h2>
            </Col>
          </Row>
          <Row className="content">{this.renderCardPokedex()}</Row>
          <Row className="footer text-center">
            <Col>
              <div className="add-my-pokedex" onClick={this.toggleModal}>
                +
              </div>
            </Col>
          </Row>
        </div>
        <SearchPokedex isOpenModal={isOpenModal} toggleModal={this.toggleModal} />
      </Fragment>
    )
  }
}

const enhance = compose(
  connect(
    ({ myPokedex }) => ({
      myPokedexes: myPokedex.myPokedexes
    }),
    { removePokedex }
  )
)

export default enhance(App)
