import React, { Component, PropTypes } from 'react'
import Logo4 from './svg/Logo4'
import Note from './Note'
import { decisionStyles } from './matrix/Decision'


import colors from './colors'

const logoContainerStyles = {padding: '20px', width: '206', borderRadius: '30px', margin: '20px'}

export default class IntroTab extends Component {
    constructor (props) {
        super(props)

        this.checkEnter = this.checkEnter.bind(this)
    }
    render() {
        const textStyles = {color: colors.yellow, fontFamily: "'Varela Round', sans-serif", fontSize: '1.1em', marginLeft: '-23px'} //-35.5px
        const headerStyles = {color: 'lightgray'}
        return (<section style={{display: (this.props.selectedTab === 'intro' ? '' : 'none')}}>
            <header>
                <div style={{background: colors.orange, textAlign: 'center', padding: '20px', borderRadius: '20px', margin: '40px 0'}}>
                    <Logo4 logoColor={colors.yellow} />
                    <text style={textStyles}>houghtPlot</text><br/>
                </div>
                <div style={{textAlign: 'center', margin: '40px 0', padding: '20px', paddingBottom: '40px', background: colors.purple, borderRadius: '20px'}}>
                    <h2 style={headerStyles}>Communicate complex decisions with ease</h2>
                    <h3 style={headerStyles}>Do you find yourself having to explain some decisions to your team over and over?</h3>
                    <h3 style={headerStyles}>Build your ThoughtPlot to get people on the same page</h3>
                    <div style={{textAlign: 'center', background: colors.blue, width: '300px', margin: '0 auto', borderRadius: '5px', paddingTop: '5px'}}>
                        <textarea value={this.props.decision} onChange={this.props.onChangeDecision} placeholder="Briefly describe a decision you've made recently" style={{width: '280px', fontSize: '1.4em', margin: '0', border: '0px', resize: 'none', background: 'transparent', color: 'white'}} onKeyPress={this.checkEnter} />
                    </div>
                </div>
            </header>
            {this.props.renderTryit()}<br/>
            <h3 style={{color: colors.blue, textAlign: 'center'}}>Further Reading:</h3>
            <Note label="For Business" content="ThoughtPlot makes it easy to communicate complicated decisions to your team so that you can spend less time in meetings and more time adding value to your business." />
            <Note label='What Is' content="People make decisions based on many variables (often political), but communicate those decisions by telling a short story that hits on the one 'most important' point. This often involves stacking data or pointing out only what is most likely to get a thumbs up from the team."/>
            <Note label="What Could Be" content="Decisions can be documented and communicated in a transparent and objective way. Each consideration can be scored on a per option basis so that it's clear which option seems best now, and it's also clear how much better the option is (and why it's better). This means that it's straight forward to go back and re-evaluate the decision when circumstances change."/>
            <br/>
            <p style={{textAlign: 'center'}}>Use ThoughtPlot to improve decision making and communication for your team<br/><a target="_blank" href='https://medium.com/@river.kanies/thoughtplot-a606eadbfd05'>Learn More</a></p>
            {this.props.renderTryit()}
        </section>)
    }

    checkEnter (e) {
        if (e.which == 13 || e.keyCode == 13) this.props.setTab('builder')()
    }
}