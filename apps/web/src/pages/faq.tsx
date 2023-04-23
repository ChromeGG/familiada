import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import { Container } from '@mui/system'
import Link from 'next/link'
import TransText from 'next-translate/TransText'
import useTranslation from 'next-translate/useTranslation'

interface QnA {
  question: string
  answer: string
}

const FAQ = () => {
  const { t } = useTranslation('faq')
  const questions = t<QnA[]>('qna', {}, { returnObjects: true, ns: 'faq' })

  return (
    <Container>
      <Typography
        variant="h3"
        sx={{ textAlign: 'center', py: 4 }}
      >{t`title`}</Typography>
      {questions.map(({ question, answer }) => {
        return (
          <Accordion key={question}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontWeight="bold">{question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <TransText
                  text={answer}
                  components={{
                    ghIssuesLink: (
                      <Link href="https://github.com/ChromeGG/familiada/issues" />
                    ),
                  }}
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
        )
      })}
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <TransText
              text={'listItem'}
              components={{
                link: <a href="some-url" />,
                em: <em />,
              }}
            />
          </Typography>
        </AccordionDetails>
      </Accordion> */}
    </Container>
  )
}

export default FAQ
