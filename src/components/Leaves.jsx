export default function Leaves() {
  const leaves = [
    { emoji: '🍃', top: '8%', left: '3%', delay: '0s', size: '52px' },
    { emoji: '🌿', top: '20%', right: '5%', delay: '-4s', size: '38px' },
    { emoji: '🍂', top: '55%', left: '1%', delay: '-8s', size: '44px' },
    { emoji: '🌱', bottom: '20%', right: '3%', delay: '-12s', size: '56px' },
    { emoji: '🍀', bottom: '40%', left: '6%', delay: '-6s', size: '32px' },
  ]

  return (
    <>
      {leaves.map((l, i) => (
        <div
          key={i}
          className="leaf"
          style={{
            top: l.top,
            left: l.left,
            right: l.right,
            bottom: l.bottom,
            fontSize: l.size,
            animationDelay: l.delay,
          }}
        >
          {l.emoji}
        </div>
      ))}
    </>
  )
}
