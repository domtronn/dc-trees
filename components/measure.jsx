import React from 'react'

export class MeasureRender extends React.Component {
  constructor() {
    super()
    this.mounted = false
  }

  render() {
    const { name } = this.props
    if (typeof window === 'undefined') return this.props.children

    if (this.mounted) {
      window.performance.mark(`${name}UpdateStart`)
    } else {
      window.performance.mark(`${name}MountStart`)
    }
    return this.props.children
  }

  componentDidMount() {
    const { name } = this.props
    if (typeof window === 'undefined') return

    this.mounted = true
    window.performance.mark(`${name}MountEnd`)
    console.log(
      `${name} render:\t`, window.performance.measure(`${name}Mount`, `${name}MountStart`, `${name}MountEnd`).duration
    )
  }

  componentDidUpdate() {
    const { name } = this.props
    if (typeof window === 'undefined') return

    window.performance.mark(`${name}UpdateEnd`)
    console.log(
      `${name} render:\t`, window.performance.measure(`${name}Update`, `${name}UpdateStart`, `${name}UpdateEnd`).duration
    )
  }
}
