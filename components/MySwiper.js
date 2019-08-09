import React, { Component } from 'react';
import Swiper from 'react-native-deck-swiper';

// https://github.com/i18next/react-i18next/issues/599#issuecomment-435010519
// Come passare ref dal figlio Swiper al padre MySwiper in offers.js

export default class MySwiper extends Component {

    constructor(props){
        super(props)                
    }

    
    render () {

        const { cardIndex } = this.props;
        return (
            <Swiper
                {...this.props}
                ref={this.props.refSwiper}    
                containerStyle={{backgroundColor: 'transparent'}}
                // onSwiped={() => this.onSwiped('general')}
                // onSwipedLeft={() => this.onSwiped('left')}
                // onSwipedRight={() => this.onSwiped('right')}
                // onSwipedTop={() => this.onSwiped('top')}
                // onSwipedBottom={() => this.onSwiped('bottom')}
                // onTapCard={this.swipeLeft}
                // cardVerticalMargin={80}
                // onSwiped={(index)=>{this.setState({ActiveSlide: index}); console.log(index)}}
                //
                // cards={this.props.cards}
                // renderCard={this.props.renderCard}
                // onSwipedAll={this.props.onSwipedAll}
                stackSize={3}
                stackSeparation={10}
                // verticalSwipe={false}
                horizontalThreshold={50}
                overlayLabels={null}
                animateOverlayLabelsOpacity
                animateCardOpacity
                swipeBackCard
                cardIndex={cardIndex}
            />
        );

    }

}