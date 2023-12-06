// DashboardConfiguration.jsx

import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useMutation, gql } from '@apollo/client';
import { validateFunc } from '../../../constraints/constraints';
import { saveDashboardConfiguration } from '../../../apollo';
import useStyles from '../styles';
import useGlobalStyles from '../../../utils/globalStyles';
import { Box, Switch, Typography, Input, Button } from '@mui/material';

const SAVE_DASHBOARD_CONFIGURATION = gql`
  ${saveDashboardConfiguration}
`;

function ApiConfiguration(props) {
    const formRef = useRef();
    const [dashboardEnabled, setDashboardEnabled] = useState(!!props.dashboardEnabled);
    const [dashboardUrl] = useState(props.dashboardUrl || '');
    const [webUrl] = useState(props.webUrl || '');
    const [port] = useState(props.port || '');
    const [orderDetailWebUrl] = useState(props.orderDetailWebUrl || '');
    const [resetPasswordLink] = useState(props.resetPasswordLink || '');
  
    const [dashboardUrlError, setDashboardUrlError] = useState(null);
    const [webUrlError, setWebUrlError] = useState(null);
    const [portError, setPortError] = useState(null);
    const [orderDetailWebUrlError, setOrderDetailWebUrlError] = useState(null);
    const [resetPasswordLinkError, setResetPasswordLinkError] = useState(null);
  
    const [mutate, { loading }] = useMutation(SAVE_DASHBOARD_CONFIGURATION);
  
    const onBlur = (setter, field, state) => {
      setter(!validateFunc({ [field]: state }, field));
    };
  
    const validateInput = () => {
      let dashboardUrlResult = true;
      let webUrlResult = true;
      let portResult = true;
      let orderDetailWebUrlResult = true;
      let resetPasswordLinkResult = true;
  
      dashboardUrlResult = !validateFunc(
        { dashboardUrl: formRef.current['input-dashboardUrl'].value },
        'dashboardUrl'
      );
      webUrlResult = !validateFunc(
        { webUrl: formRef.current['input-webUrl'].value },
        'webUrl'
      );
      portResult = !validateFunc(
        { port: formRef.current['input-port'].value },
        'port'
      );
      orderDetailWebUrlResult = !validateFunc(
        { orderDetailWebUrl: formRef.current['input-orderDetailWebUrl'].value },
        'orderDetailWebUrl'
      );
      resetPasswordLinkResult = !validateFunc(
        { resetPasswordLink: formRef.current['input-resetPasswordLink'].value },
        'resetPasswordLink'
      );
  
      setDashboardUrlError(dashboardUrlResult);
      setWebUrlError(webUrlResult);
      setPortError(portResult);
      setOrderDetailWebUrlError(orderDetailWebUrlResult);
      setResetPasswordLinkError(resetPasswordLinkResult);
  
      return (
        dashboardUrlResult &&
        webUrlResult &&
        portResult &&
        orderDetailWebUrlResult &&
        resetPasswordLinkResult
      );
    };
  
    const classes = useStyles();
    const globalClasses = useGlobalStyles();
  
    return (
      <Box container className={classes.container}>
        <Box className={classes.flexRow}>
          <Box item className={classes.heading}>
            <Typography variant="h6" className={classes.text}>
              API Configuration
            </Typography>
          </Box>
          <Box ml={20} mt={1}>
            <label>{dashboardEnabled ? 'Disable' : 'Enable'}</label>
            <Switch
              defaultChecked={dashboardEnabled}
              value={dashboardEnabled}
              onChange={(e) => setDashboardEnabled(e.target.checked)}
              id="input-dashboardEnabled"
              name="input-dashboardEnabled"
              style={{ color: 'black' }}
            />
          </Box>
        </Box>
  
        <Box className={classes.form}>
          <form ref={formRef}>
            <Box >
            <Typography className={classes.labelText}>
            Dashboard URL
            </Typography>
              <Input
              style={{ marginTop: -1 }}
                id="input-dashboardUrl"
                name="input-dashboardUrl"
                placeholder="Dashboard URL"
                defaultValue={dashboardUrl}
                onBlur={(event) =>
                  onBlur(setDashboardUrlError, 'dashboardUrl', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  dashboardUrlError === false
                    ? globalClasses.inputError
                    : dashboardUrlError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
            </Box>
            <Box className={globalClasses.flexRow}>
                <Box>
            <Typography className={classes.labelText}>
            Web URL
            </Typography>
              <Input
              style={{ marginTop: -1 }}
                id="input-webUrl"
                name="input-webUrl"
                placeholder="Web URL"
                defaultValue={webUrl}
                onBlur={(event) =>
                  onBlur(setWebUrlError, 'webUrl', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  webUrlError === false
                    ? globalClasses.inputError
                    : webUrlError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
            </Box>
        <Box>
            <Typography className={classes.labelText}>
            Port
            </Typography>
              <Input
              style={{ marginTop: -1 }}
                id="input-port"
                name="input-port"
                placeholder="Port"
                defaultValue={port}
                onBlur={(event) =>
                  onBlur(setPortError, 'port', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  portError === false
                    ? globalClasses.inputError
                    : portError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
              </Box>
            </Box>
            <Box className={globalClasses.flexRow}>
            <Box>
            <Typography className={classes.labelText}>
            Order Detail Web URL
            </Typography>
              <Input
              style={{ marginTop: -1 }}
                id="input-orderDetailWebUrl"
                name="input-orderDetailWebUrl"
                placeholder="Order Detail Web URL"
                defaultValue={orderDetailWebUrl}
                onBlur={(event) =>
                  onBlur(setOrderDetailWebUrlError, 'orderDetailWebUrl', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  orderDetailWebUrlError === false
                    ? globalClasses.inputError
                    : orderDetailWebUrlError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
              </Box>
              <Box>
            <Typography className={classes.labelText}>
            Reset Password Link
            </Typography>
              <Input
              style={{ marginTop: -1 }}
                id="input-resetPasswordLink"
                name="input-resetPasswordLink"
                placeholder="Reset Password Link"
                defaultValue={resetPasswordLink}
                onBlur={(event) =>
                  onBlur(setResetPasswordLinkError, 'resetPasswordLink', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  resetPasswordLinkError === false
                    ? globalClasses.inputError
                    : resetPasswordLinkError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
              </Box>
            </Box>
            <Box>
              <Button
                className={globalClasses.button}
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  if (validateInput() && !loading) {
                    mutate({
                      variables: {
                        configurationInput: {
                          dashboardUrl: formRef.current['input-dashboardUrl'].value,
                          webUrl: formRef.current['input-webUrl'].value,
                          port: formRef.current['input-port'].value,
                          orderDetailWebUrl: formRef.current['input-orderDetailWebUrl'].value,
                          resetPasswordLink: formRef.current['input-resetPasswordLink'].value,
                          dashboardEnabled,
                        },
                      },
                    });
                  }
                }}
              >
                SAVE
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    );
  }
  
  export default withTranslation()(ApiConfiguration);
