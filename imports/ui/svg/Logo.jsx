import React, { Component, PropTypes } from 'react'


export default class Logo extends Component {
    render() {


        // const arm = 2
        // const branch = 20
        // const inner = 2*arm
        // const shoulder = 50 - branch - 5*arm

        // const cps = [ // control point displacements
        //     {x: 0, y: arm},
        //     {x: branch, y: 0},
        //     {x: 0, y: branch},
        //     {x: 2*arm, y: 0},
        //     {x: 0, -branch},
        //     {x: shoulder, y: inner},
        //     {x: inner, y: shoulder},
        //     {x:-branch, y: 0},
        //     {x: 0, y: 2*arm},
        //     {x: branch, y: 0},
        //     {x: 0, y: branch},
        // ]
        // let path = 'M -50 0'
        // cps.forEach((cp, i)=>{
        //     if (i<1) return
        //     const cpl = cps[i-1]
        //     const p = {x: } //displacements for next point on curve
        //     path = `${path} q ${}`
        // })
        

        const arm = 2
        const branch = 8
        const shoulder = (50-2*branch-5*arm)/2

        const path = [
            'M -50 0',
            `q 0 ${arm} ${branch} ${arm}`,
            `q ${branch} 0 ${branch} ${branch}`,
            `q 0 ${branch} ${arm} ${branch}`,// hand
            `q ${arm} 0 ${arm} ${-branch}`,
            `q 0 ${-branch} ${shoulder} ${-(branch-arm)}`,
            `q ${shoulder} ${arm} ${shoulder+arm} ${shoulder+arm}`,
            `q ${arm} ${shoulder} ${arm-branch} ${shoulder}`,
            `q ${-branch} 0 ${-branch} ${arm}`,
            `q 0 ${arm} ${branch} ${arm}`,
            `q ${branch} 0 ${branch} ${branch}`,
            `q 0 ${branch} ${arm} ${branch}`,
        ].join(' ')

        return <svg height="200" width="200" viewBox="-55 -55 110 110">
            <circle id="pointA" cx="-50" cy="0" r="3" />
            <circle id="BR" cx="50" cy="50" r="3" />
            <circle id="TR" cx="50" cy="-50" r="3" />

            <path d={path} stroke="green" strokeWidth="1" fill="none" />

            Sorry, your browser does not support inline SVG.  
        </svg>
    }
}

// <path d="M -50 0 q 50 0 50 50" stroke="blue" strokeWidth="2" fill="none" />
// using q: first two vals are x and y displacement from current position to control point
//          second pair are x and y for displacement form current pos to final pos