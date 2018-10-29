// @flow
import React, {Component} from 'react';
import { Button, Content, Text, View, Icon } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native';

import * as Models from '../../../clypr-shared/models/dataModels';
import Lang from '../../../clypr-shared/services/lang';
import {Variables} from '../../../styles/global';

import {Loading} from '../../components/Loading';

type Props = {
  onSubmit: (ratings: Models.BarberReviewRatings, review: string, tip: number) => void;
  isLoading: boolean;
};

type State = {
  review: string;
  customerServiceQuality: number;
  barberPunctuality: number;
  haircutQuality: number;

  tip: number;
  isTipCustomAmount: boolean;
};

/** Implements Barber Review Create screen for Web platform. */
export class BarberReviewCreateScreen extends Component {

  props: Props;
  state: State = {
    review: '',
    customerServiceQuality: 0,
    barberPunctuality: 0,
    haircutQuality: 0,

    tip: 0,
    isTipCustomAmount: false
  };

  render() {
    if (this.props.isLoading) { return <Loading />; }

    return (
      <Content>
        <View style={style.section}>
          <Text style={style.title}>{Lang('barber_review_title')}</Text>

          <Text style={style.question}>{Lang('barber_review_aspect_customer')}:</Text>
          {this.getRatingComponent('customerServiceQuality')}

          <Text style={style.question}>{Lang('barber_review_aspect_time')}:</Text>
          {this.getRatingComponent('barberPunctuality')}

          <Text style={style.question}>{Lang('barber_review_aspect_haircut')}:</Text>
          {this.getRatingComponent('haircutQuality')}

          <Text style={style.question}>{Lang('barber_review_tip')}:</Text>
          <View style={style.tipSelector}>
            <View style={style.tipInCash}>
              {this.getTipButton(0, Lang('barber_review_tip_cash'))}
            </View>

            <View style={style.tipAmount}>
              {this.getTipButton(2)}
              {this.getTipButton(5)}
              {this.getTipButton(10)}

              <View style={this.state.isTipCustomAmount ? style.tipCustomActive : style.tipCustom}>
                <Text style={style.tipCustomLabel}>$</Text>
                <TextInput
                  placeholder={Lang('barber_review_tip_custom')}
                  placeholderTextColor="black"
                  style={style.tipCustomInput}
                  keyboardType="numeric"
                  onChangeText={this.updateCustomTip}/>
              </View>
            </View>
          </View>

          <Text style={style.question}>{Lang('barber_review_text')}:</Text>
            <TextInput multiline={true}
                   style={style.textInput}
                   value={this.state.review}
                      onChangeText={review => { this.setState({ review }); }} />
        </View>

        <Button full transparent
                style={style.submit}
                onPress={this.save}>
          <Text style={style.submitText}>{Lang('barber_review_submit')}</Text>
        </Button>
      </Content>
    );
  }

  getTipButton = (amount: number, label?: string) => {
    const itemStyle = {...style.tipButton};
    if (!this.state.isTipCustomAmount && this.state.tip === amount) { Object.assign(itemStyle, style.tipButtonActive); }

    return (
      <Button
        small
        light
        style={itemStyle}
        onPress={() => { this.setState({ tip: amount, isTipCustomAmount: false }); }} >
        <Text>{label || `$${amount}`}</Text>
      </Button>
    );
  }

  updateCustomTip = (chosenTip: string = '0') => {
    // Convert tip to number
    let tip = Number(chosenTip);

    this.setState({
      tip,
      isTipCustomAmount: (tip > 0)
    });
  }

  getRatingComponent = (subject: string) => {
    const ratings = [1, 2, 3, 4, 5];

    return (
      <View style={style.grade}>

        {ratings.map(grade => (
          <TouchableOpacity key={grade} onPress={() => { this.addRating(subject, grade); }} style={style.starButton}>
            <Icon name="star" active style={grade <= this.state[subject] ? style.starActive : style.star}/>
          </TouchableOpacity>
        ))}

      </View>
    );
  };

  addRating = (subject: string, value: number) => {
    this.setState({[subject]: value});
  };

  save = () => {
    // Get ratings
    const review = this.state.review;
    const ratings: Models.BarberReviewRatings = {
      customerServiceQuality: this.state.customerServiceQuality,
      barberPunctuality: this.state.barberPunctuality,
      haircutQuality: this.state.haircutQuality
    };

    // Submit review
    this.props.onSubmit(ratings, review, this.state.tip || 0);
  };

}

const variables = {
  activeTipColor: Variables.primaryColor
};

const style = {

  section: {
    margin: 20
  },

  title: {
    fontSize: 18,
    textAlign: 'center'
  },

  question: {
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 5
  },

  textInput: {
    height: 60,
    width: '100%',
    borderWidth: 1,
    borderColor: Variables.lightGrey,
    marginVertical: 10,
    padding: 10,
    fontSize: 16
  },

  grade: {
    flexDirection: 'row'
  },

  starButton: {
    marginRight: 10
  },

  star: {
    color: Variables.disabledGrey
  },

  starActive: {
    color: Variables.primaryColor
  },

  submit: {
    backgroundColor: Variables.primaryColor,
  },

  submitText: {
    color: 'white'
  },


  tipSelector: {},

  tipInCash: {
    marginBottom: 5
  },

  tipAmount: {
    flexDirection: 'row'
  },

  tipButton: {
    marginRight: 5
  },

  tipButtonActive: {
    backgroundColor: variables.activeTipColor
  },

  tipCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Variables.lightGrey,
    marginLeft: 10,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5
  },

  tipCustomActive: {},

  tipCustomInput: {
    width: 55,
    fontSize: 14
  },

  tipCustomLabel: {
    fontSize: 14,
    marginRight: 5
  }

};

style.tipCustomActive = Object.assign({}, style.tipCustom, {
  backgroundColor: variables.activeTipColor
});
