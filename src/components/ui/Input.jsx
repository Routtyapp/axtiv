import { TextField, TextArea } from '@radix-ui/themes'

const Input = ({
  label,
  placeholder,
  multiline = false,
  rows = 3,
  error,
  ...props
}) => {
  const Component = multiline ? TextArea : TextField.Root

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {multiline ? (
        <TextArea
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
      ) : (
        <TextField.Root>
          <TextField.Input
            placeholder={placeholder}
            {...props}
          />
        </TextField.Root>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default Input