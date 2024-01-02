import React, { useRef, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveEmailConfiguration } from '../../../apollo'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
import { Box, Switch, Typography, Input, Button, Grid } from '@mui/material'
const SAVE_EMAIL_CONFIGURATION = gql`
  ${saveEmailConfiguration}
`

function Email(props) {
  const { t } = props;
  const formRef = useRef()
  const email = props.email || ''
  const password = props.password || ''
  const emailName = props.emailName || ''
  const [emailError, emailErrorSetter] = useState(null)
  const [passwordError, passwordErrorSetter] = useState(null)
  const [emailNameError, emailNameErrorSetter] = useState(null)
  const [enableEmail, setEnabaleEmail] = useState(!!props.enabled)
  const [mutate, { loading }] = useMutation(SAVE_EMAIL_CONFIGURATION)

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field))
  }
  const validateInput = () => {
    let emailResult = true
    let passwordResult = true
    let emailNameResult = true
    emailResult = !validateFunc(
      { email: formRef.current['input-email'].value },
      'email'
    )
    emailNameResult = !validateFunc(
      { email: formRef.current['input-emailName'].value },
      'emailName'
    )
    passwordResult = !validateFunc(
      { password: formRef.current['input-password'].value },
      'password'
    )
    emailErrorSetter(emailResult)
    passwordErrorSetter(passwordResult)
    emailNameErrorSetter(emailNameResult)
    return emailResult && passwordResult && emailNameResult
  }
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>

            NodeMailer Email

          </Typography>
        </Box>
        <Box ml={20} mt={1}>
          <label>{enableEmail ? t('Disable') : t('Enable')}</label>
          <Switch
            defaultChecked={enableEmail}
            value={enableEmail}
            onChange={e => setEnabaleEmail(e.target.checked)}
            id="input-available"
            name="input-available"
            style={{ color: 'black' }}
          />
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Grid container spacing={2}>
            {/* First Row */}
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>{t('Email')}</Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-email"
                  name="input-email"
                  placeholder={t('PHMail')}
                  type="text"
                  defaultValue={email}
                  onBlur={event =>
                    onBlur(emailErrorSetter, 'email', event.target.value)
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    emailError === false
                      ? globalClasses.inputError
                      : emailError === true
                        ? globalClasses.inputSuccess
                        : ''
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography className={classes.labelText}>{t('EmailName')}</Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-emailName"
                  name="input-emailName"
                  placeholder={t('PHEnatega')}
                  type="text"
                  defaultValue={emailName}
                  onBlur={event =>
                    onBlur(emailNameErrorSetter, 'emailName', event.target.value)
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    emailNameError === false
                      ? globalClasses.inputError
                      : emailNameError === true
                        ? globalClasses.inputSuccess
                        : ''
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography className={classes.labelText}>{t('Password')}</Typography>
                <Input
                  style={{ marginTop: -1 }}
                  id="input-password"
                  name="input-password"
                  placeholder={t('PHFood')}
                  type="password"
                  defaultValue={password}
                  onBlur={event =>
                    onBlur(passwordErrorSetter, 'password', event.target.value)
                  }
                  disableUnderline
                  className={[
                    globalClasses.input,
                    passwordError === false
                      ? globalClasses.inputError
                      : passwordError === true
                        ? globalClasses.inputSuccess
                        : ''
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
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
                        email: formRef.current['input-email'].value,
                        emailName: formRef.current['input-emailName'].value,
                        password: formRef.current['input-password'].value,
                        enableEmail: enableEmail
                      }
                    }
                  })
                }
              }}>
              {t('Save')}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}
export default withTranslation()(Email)
