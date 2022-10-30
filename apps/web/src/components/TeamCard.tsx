import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { COLORS } from '../configuration/theme'

import type { Player, Team } from '../interfaces/common'

interface Props {
  team: {
    color: Team['color']
    players: Pick<Player, 'name'>[]
  }
}

const TeamCard = ({ team }: Props) => {
  const { t } = useTranslation()

  const isRed = team.color === 'RED'

  return (
    <Card>
      <CardHeader
        title={isRed ? t`team-red` : t`team-blue`}
        sx={{
          color: isRed ? COLORS.RED.MAIN : COLORS.BLUE.MAIN,
        }}
      />
      <CardContent>
        <List>
          {team.players.map((player) => (
            <ListItem key={player.name}>
              <ListItemText>{player.name} </ListItemText>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default TeamCard
