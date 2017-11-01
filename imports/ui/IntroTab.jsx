import React, { Component, PropTypes } from 'react'
import Logo from './svg/Logo'
import Logo2 from './svg/Logo2'


export default class IntroTab extends Component {
    render() {
        return (<section style={{display: (this.props.selectedTab === 'intro' ? '' : 'none')}}>
            <Logo />
            <Logo2 />
            <header>
            <h1>About ThotPlot</h1>
            </header>
            <h4>
            ThotPlot makes it easy to communicate complicated decisions to your team so that you can spend less time in meetings and more time adding value to your business.
            </h4>
            {this.props.renderTryit()}
            <h3>Further Reading:</h3>
            <p><b>What is:</b> People make decisions based on many variables (often political), but communicate those decisions by telling a short story that hits on the one 'most important' point. This often involves stacking data or pointing out only what is most likely to get a thumbs up from the team.</p>
            <p><b>What could be:</b> Decisions can be documented and communicated in a transparent and objective way. Each consideration can be scored on a per option basis so that it's clear which option seems best now, and it's also clear how much better the option is (and why it's better). This means that it's straight forward to go back and re-evaluate the decision when circumstances change.</p>
            <p>Use ThotPlot to improve decision making and communication for your team:</p>
            {this.props.renderTryit()}
        </section>)
    }
}