import { IconButton as RadixIconButton } from '@radix-ui/themes'

const IconButton = ({
  children,
  variant = "soft",
  size = "2",
  color = "gray",
  ...props
}) => {
  return (
    <RadixIconButton
      variant={variant}
      size={size}
      color={color}
      {...props}
    >
      {children}
    </RadixIconButton>
  )
}

export default IconButton