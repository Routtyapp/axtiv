import { Card as RadixCard } from '@radix-ui/themes'

const Card = ({ children, className, ...props }) => {
  return (
    <RadixCard
      className={className}
      {...props}
    >
      {children}
    </RadixCard>
  )
}

export default Card