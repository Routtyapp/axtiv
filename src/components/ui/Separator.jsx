import { Separator as RadixSeparator } from '@radix-ui/themes'

const Separator = ({ size = "4", orientation = "horizontal", ...props }) => {
  return (
    <RadixSeparator
      size={size}
      orientation={orientation}
      {...props}
    />
  )
}

export default Separator