import React, { PureComponent } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import {
  Row,
  Col,
  Modal,
  ModalBody,
  InputGroup,
  InputGroupAddon,
  Button,
  Input
} from 'reactstrap'
import isEqual from 'lodash.isequal'

import { addPokedex } from '../Action/myPokedex'
import { CardPokedex } from './'
import './SearchPokedex.css'

class SearchPokedex extends PureComponent {
  state = {
    cards: [],
    searchText: ''
  }

  componentDidMount() {
    axios
      .get('http://localhost:3030/api/cards')
      .then(response => {
        this.setState({
          cards: this.calculateLevel(response.data.cards)
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  componentDidUpdate(prevProps) {
    const { myPokedexes } = this.props
    const { cards } = this.state

    if (!isEqual(prevProps.myPokedexes, myPokedexes)) {
      this.setState({
        cards: [...cards.filter(card => !myPokedexes.includes(card))]
      })
    }
  }

  calculateLevel = cards => {
    const calculateHp = hp => {
      if (Number(hp) > 100) {
        return 100
      } else if (Number(hp) <= 100) {
        return Number(hp)
      } else {
        return 0
      }
    }

    const calculateAtk = attacks => {
      const atkLevel = !!attacks ? Number(attacks.length) * 50 : 0
      return atkLevel
    }

    const calculateWeak = weaknesses => {
    //   if(Number(weaknesses) === '1'){
    //     return 100
    //   }
    // else{
    //   return 0
    // }
      const weakLevel = !!weaknesses ? Number(weaknesses.length) * 100 : 0
      return weakLevel
    }

    const calculateDamage = attacks => {
      if (!!attacks) {
        const listOfDamage = attacks
          .filter(attack => !!attack.damage)
          .map(attack => attack.damage.replace(/\D+/g, ''))
          .reduce((a, b) => Number(a) + Number(b), 0)
        return listOfDamage
      } else {
        return 0
      }
    } 

    return cards.map(card => {
      const hp = calculateHp(card.hp)
      const atk = calculateAtk(card.attacks)
      const weak = calculateWeak(card.weaknesses)
      const damage = calculateDamage(card.attacks)
      const level = parseInt(((10 + weak + hp / 10 + damage / 10)/5) / 5)
      //const level = Math.round(((hp/10) + (damage/10) + 10 - (weak)) / 5)
      return {
        ...card,
        hp: hp,
        atk: atk,
        weak: weak,
        level: level
      }
    })
  }

  onAddPokedex = cardAdd => () => {
    const { addPokedex } = this.props
    addPokedex(cardAdd)
  }

  onChangeSearchText = e => {
    this.setState({ searchText: e.target.value })
  }

  onSearchPokedex = () => {
    const { searchText } = this.state

    axios
      .get(
        `http://localhost:3030/api/cards?limit=20&name=${searchText}&type=${searchText}`
      )
      .then(response => {
        this.setState({
          cards: this.calculateLevel(response.data.cards)
        })
      })
      .catch(error => {
        console.log(error) 
      })
  }

  render() {
    const { cards, searchText } = this.state
    const { isOpenModal, toggleModal } = this.props

    return (
      <Modal isOpen={isOpenModal} toggle={toggleModal} className="search-pokedex">
        <ModalBody>
          <Row>
            <Col sm="12" className="search-row">
              <InputGroup>
                <Input onChange={this.onChangeSearchText} value={searchText} />
                <InputGroupAddon addonType="append">
                  <Button onClick={this.onSearchPokedex}>search</Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            {cards.map((card, index) => (
              <Col sm="12" key={index} className="card-row">
                <CardPokedex textAction="Add" card={card} action={this.onAddPokedex} />
              </Col>
            ))}
          </Row>
        </ModalBody>
      </Modal>
    )
  }
}

const enhance = compose(
  connect(
    ({ myPokedex }) => ({
      myPokedexes: myPokedex.myPokedexes
    }),
    { addPokedex }
  )
)

export default enhance(SearchPokedex)
