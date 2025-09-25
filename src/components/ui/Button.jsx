import { Button as RadixButton } from '@radix-ui/themes'

const Button = ({ children, variant = "solid", size = "2", color = "blue", ...props }) => {
  return (
    <RadixButton
      variant={variant}
      size={size}
      color={color}
      {...props}
    >
      {children}
    </RadixButton>
  )
}

export default Button