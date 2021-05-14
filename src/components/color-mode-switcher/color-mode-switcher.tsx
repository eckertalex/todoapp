import {useColorMode, useColorModeValue, IconButton, IconButtonProps} from '@chakra-ui/react'
import {Moon as MoonIcon, Sun as SunIcon} from 'lucide-react'

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>

function ColorModeSwitcher(props: ColorModeSwitcherProps) {
  const {toggleColorMode} = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon)

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  )
}

export {ColorModeSwitcher}
