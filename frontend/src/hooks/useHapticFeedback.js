// Haptic feedback utility for mobile devices
export function useHapticFeedback() {
  const vibrate = (pattern = [10]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  return { vibrate }
}

