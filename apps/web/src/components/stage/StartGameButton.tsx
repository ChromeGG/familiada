import useTranslation from 'next-translate/useTranslation'

import Button from '../Button'

const StartGameButton = () => {
  const { t } = useTranslation()

  return <Button disabled>{t`start-game`}</Button>
}

export default StartGameButton
