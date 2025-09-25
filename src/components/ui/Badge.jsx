import { Badge as RadixBadge } from '@radix-ui/themes'

const Badge = ({
  children,
  variant = "solid",
  size = "1",
  color = "blue",
  ...props
}) => {
  return (
    <RadixBadge
      variant={variant}
      size={size}
      color={color}
      {...props}
    >
      {children}
    </RadixBadge>
  )
}

export default Badge