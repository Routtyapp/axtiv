import { Tooltip as RadixTooltip } from '@radix-ui/themes'

const Tooltip = ({ children, content, ...props }) => {
  return (
    <RadixTooltip content={content} {...props}>
      {children}
    </RadixTooltip>
  )
}

export default Tooltip