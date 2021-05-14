import React from 'react'
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react'
import {Eye as EyeIcon, EyeOff as EyeOffIcon} from 'lucide-react'

const PasswordField = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {isOpen, onToggle} = useDisclosure()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const mergeRef = useMergeRefs(inputRef, ref)

  const onClickReveal = () => {
    onToggle()
    const input = inputRef.current
    if (input) {
      input.focus({preventScroll: true})
      const length = input.value.length * 2
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length)
      })
    }
  }

  return (
    <FormControl id="password">
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <InputRightElement>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <EyeOffIcon /> : <EyeIcon />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input ref={mergeRef} type={isOpen ? 'text' : 'password'} autoComplete="current-password" required {...props} />
      </InputGroup>
    </FormControl>
  )
})

PasswordField.displayName = 'PasswordField'
export {PasswordField}
