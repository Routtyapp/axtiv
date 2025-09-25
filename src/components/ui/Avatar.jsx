import { Avatar as RadixAvatar } from '@radix-ui/themes'

const Avatar = ({
  src,
  alt,
  fallback,
  size = "3",
  radius = "full",
  color = "blue",
  ...props
}) => {
  // fallback이 없으면 alt나 이름의 첫글자 사용
  const getFallback = () => {
    if (fallback) return fallback
    if (alt) return alt.charAt(0).toUpperCase()
    return '?'
  }

  return (
    <RadixAvatar
      size={size}
      src={src}
      alt={alt}
      fallback={getFallback()}
      radius={radius}
      color={color}
      {...props}
    />
  )
}

export default Avatar