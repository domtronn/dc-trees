export const unanimate = () => {
  ;[...document.querySelectorAll('.branch')]
    .forEach(p => {
      p.style.transitionDuration = '0.2s'
      p.style.transitionDelay = '0s'
    })

  ;[...document.querySelectorAll('.flower')]
    .forEach(p => {
      p.style.transitionDuration = '0.2s'
      p.style.transitionDelay = '0s'
    })
}

export const animate = (data, { onStart, onEnd }) => {
  onStart()
  document
    .getElementById('tree')
    .style
    .opacity = 1

  ;[...document.querySelectorAll('.branch')]
    .forEach(p => {
      p.style.transitionDuration = '0s'
      p.style.transitionDelay = '0s'
      p.style.strokeDashoffset = p.getAttribute('data-length')
    })

  ;[...document.querySelectorAll('.flower')]
    .forEach(p => {
      p.style.transitionDuration = '0s'
      p.style.transitionDelay = '0s'
      p.style.opacity = 0
    })

  setTimeout(_ => {
    [...document.querySelectorAll('.branch')]
      .forEach(p => {
        p.style.transitionDuration = '0.3s'
        p.style.transitionDelay = `${p.getAttribute('data-delay')}s`
        p.style.strokeDashoffset = 0
      })
    ;[...document.querySelectorAll('.flower')]
      .forEach(p => {
        p.style.transitionDuration = '0.2s'
        p.style.transitionDelay = `${p.getAttribute('data-delay')}s`
        p.style.opacity = 1
      })
  }, 1)

  const branchAnimationDuration = data.length * 0.3
  const flowerAnimationDuration = (data[data.length - 1].length * 0.01) + 0.2
  setTimeout(onEnd, (branchAnimationDuration + flowerAnimationDuration) * 1000)
}
