// SendGridConfiguration.jsx

import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveSendGridApiKey } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Switch, Typography, Input, Button } from '@mui/material'

const SAVE_SENDGRID_API_KEY = gql`
  ${saveSendGridApiKey}
`

function SendGridConfiguration(props) {
  const formRef = useRef()
  const [sendGridEnabled, setSendGridEnabled] = useState(
    !!props.sendGridEnabled
  )
  const [sendGridApiKey] = useState(props.sendGridApiKey || '')

  const [apiKeyError, setApiKeyError] = useState(null)

  const [mutate, { loading }] = useMutation(SAVE_SENDGRID_API_KEY)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }

  const validateInput = () => {
    let apiKeyResult = true

    apiKeyResult = !validateFunc(
      { sendGridApiKey: formRef.current['input-apiKey'].value },
      'sendGridApiKey'
    )

    setApiKeyError(apiKeyResult)

    return apiKeyResult
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            SendGrid
          </Typography>
        </Box>
        <Box ml={20} mt={1}>
          <label>{sendGridEnabled ? 'Disable' : 'Enable'}</label>
          <Switch
            defaultChecked={sendGridEnabled}
            value={sendGridEnabled}
            onChange={e => setSendGridEnabled(e.target.checked)}
            id="input-sendGridEnabled"
            name="input-sendGridEnabled"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              SendGrid API Key
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-apiKey"
              name="input-apiKey"
              placeholder="SendGrid API Key"
              defaultValue={sendGridApiKey}
              type="password"
              onBlur={event =>
                onBlur(setApiKeyError, 'sendGridApiKey', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                apiKeyError === false
                  ? globalClasses.inputError
                  : apiKeyError === true
                  ? globalClasses.inputSuccess
                  : ''
              ]}
            />
          </Box>
          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={e => {
                e.preventDefault()
                if (validateInput() && !loading) {
                  mutate({
                    variables: {
                      configurationInput: {
                        sendGridApiKey: formRef.current['input-apiKey'].value
                      }
                    }
                  })
                }
              }}>
              SAVE
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default withTranslation()(SendGridConfiguration)
