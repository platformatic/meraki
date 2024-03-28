import { useEffect, useState, useRef } from 'react'

export default function useOnScreen (ref) {
  const [isOnScreen, setIsOnScreen] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line no-undef
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting)
    )
  }, [])

  useEffect(() => {
    observerRef.current.observe(ref.current)

    return () => {
      observerRef.current.disconnect()
    }
  }, [ref])

  return isOnScreen
}
