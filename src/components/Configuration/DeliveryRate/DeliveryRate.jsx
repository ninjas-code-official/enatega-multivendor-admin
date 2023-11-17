import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'
import { validateFunc } from '../../../constraints/constraints'
import { saveDeliveryRateConfiguration } from '../../../apollo'
import { Box, Typography, Input, Button } from '@mui/material'
import useStyles from '../styles'
import useGlobalStyles from '../../../utils/globalStyles'
const SAVE_DELIVERY_RATE_CONFIGURATION = gql`
  ${saveDeliveryRateConfiguration}
`

function Currency(props) {
  const { t } = props;
  const [deliveryRate, setDeliveryRate] = useState(props.deliveryRate || 0)

  const [deliveryRateError, setDeliveryRateError] = useState(null)
  const [mutate, { loading }] = useMutation(SAVE_DELIVERY_RATE_CONFIGURATION)

  const validateInput = () => {
    const deliveryRateErrors = !validateFunc(
      { deliveryRate: deliveryRate },
      'deliveryRate'
    )

    setDeliveryRateError(deliveryRateErrors)
    return deliveryRateErrors
  }

  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {t('Delivery Rate')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form>
          <Box>
            <Typography className={classes.labelText}>{t('Delivery Rate')}</Typography>
            <Input
              style={{ marginTop: -1 }}
              disabled
              id="input-delivery"
              name="input-delivery"
              placeholder={t('Delivery Rate')}
              type="text"
              defaultValue={deliveryRate}
              onChange={e => {
                setDeliveryRate(e.target.value)
              }}
              disableUnderline
              className={[
                globalClasses.input,
                deliveryRateError === false
                  ? globalClasses.inputError
                  : deliveryRateError === true
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
                if (validateInput()) {
                  mutate({
                    variables: {
                      deliveryRate: Number(deliveryRate)
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

export default withTranslation()(Currency)
