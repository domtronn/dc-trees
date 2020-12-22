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
    const measure = window.performance.measure(`${name}Mount`, `${name}MountStart`, `${name}MountEnd`) || {}

    if (!measure.duration) return
    console.log(`${name} render:\t`, measure.duration)
  }

  componentDidUpdate() {
    const { name } = this.props
    if (typeof window === 'undefined') return

    window.performance.mark(`${name}MountEnd`)
    const measure = window.performance.measure(`${name}Mount`, `${name}MountStart`, `${name}MountEnd`) || {}

    if (!measure.duration) return
    console.log(`${name} render:\t`, measure.duration)
  }
}
