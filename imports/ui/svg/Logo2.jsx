import React, { Component, PropTypes } from 'react'

const logoColor = "black"


export default class Logo extends Component {
    render() {
        const arm = 2
        const branch = 8
        const body = 4*arm/2
        const shoulder = (50-2*branch-3*arm-2*body)/2

        const path = [
            'M 0 0',
            'L -50 0',
            `q 0 ${arm} ${branch} ${arm}`,
            `q ${branch} 0 ${branch} ${branch}`,
            `q 0 ${branch} ${arm} ${branch}`,// hand
            `q ${arm} 0 ${arm} ${-branch}`,
            `q 0 ${-branch} ${shoulder} ${-(branch-body)}`,
            `q ${shoulder} ${body} ${shoulder+body} ${shoulder+body}`,
            `q ${body} ${shoulder} ${body-branch} ${shoulder}`,
            `q ${-branch} 0 ${-branch} ${arm}`,
            `q 0 ${arm} ${branch} ${arm}`,
            `q ${branch} 0 ${branch} ${branch}`,
            `q 0 ${branch} ${arm} ${branch}`,
            ' z'
        ].join(' ')

        const face = 20
        const skull = (50-2*face)/2
        const line = 20
        const neck = 50-branch-line-skull

        const pathHead = [
            'M 50 0',
            'L 0 0',
            `l 0 ${-skull}`,
            `c ${face-5} 0 ${face+5} ${-2*face} 0 ${-2*face}`,
            `l 0 ${-skull}`,
            `c ${face+skull+3} 0 ${face+skull-5} ${2*(face+skull)-18} 15 ${2*(face+skull)-10}`, // bump
            `Q ${2.2*skull} ${-arm} ${skull+neck} ${-arm}`,
            `L ${50-branch} ${-arm}`,
            `Q 50 ${-arm} 50 0`,
            'z'
        ].join(' ')

        return <svg height="200" width="200" viewBox="-55 -55 110 110">
            <path d={path} stroke={logoColor} strokeWidth="1" fill={logoColor} />
            <path d={path} stroke={logoColor} strokeWidth="1" fill={logoColor} transform="scale(-1,1)"/>

            <path d={pathHead} stroke={logoColor} strokeWidth="1" fill={logoColor} />
            <path d={pathHead} stroke={logoColor} strokeWidth="1" fill={logoColor} transform="scale(-1,1)"/>

            Sorry, your browser does not support inline SVG.  
        </svg>
    }
}

// <path d="M -50 0 q 50 0 50 50" stroke="blue" strokeWidth="2" fill="none" />
// using q: first two vals are x and y displacement from current position to control point
//          second pair are x and y for displacement form current pos to final pos