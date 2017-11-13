import React, { Component, PropTypes } from 'react'
import Logo4 from './svg/Logo4'
import Note from './Note'

import colors from './colors'

const logoContainerStyles = {padding: '20px', width: '206', borderRadius: '30px', margin: '20px'}

export default class IntroTab extends Component {
    render() {
        const textStyles = {color: colors.yellow, fontFamily: "'Varela Round', sans-serif", fontSize: '1.1em', marginLeft: '-23px'} //-35.5px
        return (<section style={{display: (this.props.selectedTab === 'intro' ? '' : 'none')}}>
            <header>
            <div style={{background: colors.orange, textAlign: 'center', padding: '20px', borderRadius: '20px', margin: '40px'}}>
                <Logo4 logoColor={colors.yellow} />
                <text style={textStyles}>hotPlot</text>
            </div>
            </header>
            <h4 style={{color: colors.blue, textAlign: 'center', margin: '0 10%'}}>
            ThotPlot makes it easy to communicate complicated decisions to your team so that you can spend less time in meetings and more time adding value to your business.
            </h4>
            {this.props.renderTryit()}<br/>
            <h3 style={{color: colors.blue, textAlign: 'center'}}>Further Reading:</h3>
            <Note label='What Is' content="People make decisions based on many variables (often political), but communicate those decisions by telling a short story that hits on the one 'most important' point. This often involves stacking data or pointing out only what is most likely to get a thumbs up from the team."/>
            <Note label="What Could Be" content="Decisions can be documented and communicated in a transparent and objective way. Each consideration can be scored on a per option basis so that it's clear which option seems best now, and it's also clear how much better the option is (and why it's better). This means that it's straight forward to go back and re-evaluate the decision when circumstances change."/>
            <br/>
            <p style={{textAlign: 'center'}}>Use ThotPlot to improve decision making and communication for your team:</p>
            {this.props.renderTryit()}
        </section>)
    }
}