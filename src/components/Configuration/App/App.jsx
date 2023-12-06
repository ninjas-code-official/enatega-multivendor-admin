// AppConfigurations.jsx

import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useMutation, gql } from '@apollo/client';
import { validateFunc } from '../../../constraints/constraints';
import { saveAppConfiguration } from '../../../apollo'; // Update with the correct import path
import useStyles from '../styles';
import useGlobalStyles from '../../../utils/globalStyles';
import { Box, Typography, Input, Button } from '@mui/material';

const SAVE_APP_CONFIGURATION = gql`
  ${saveAppConfiguration}
`;

function AppConfigurations(props) {
  const formRef = useRef();
  const [graphqlUrlApp] = useState(props.graphqlUrlApp || '');
  const [wsGraphqlUrlApp] = useState(props.wsGraphqlUrlApp || '');
  const [serverUrlApp] = useState(props.serverUrlApp || '');
  const [termsAndConditions] = useState(props.termsAndConditions || '');
  const [privacyPolicy] = useState(props.privacyPolicy || '');
  const [testOtp] = useState(props.testOtp || '');

  const [graphqlUrlError, setGraphqlUrlError] = useState(null);
  const [wsGraphqlUrlError, setWsGraphqlUrlError] = useState(null);
  const [serverUrlError, setServerUrlError] = useState(null);
  const [termsAndConditionsError, setTermsAndConditionsError] = useState(null);
  const [privacyPolicyError, setPrivacyPolicyError] = useState(null);
  const [testOtpError, setTestOtpError] = useState(null);

  const [mutate, { loading }] = useMutation(SAVE_APP_CONFIGURATION);

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field));
  };

  const validateInput = () => {
    let graphqlUrlResult = true;
    let wsGraphqlUrlResult = true;
    let serverUrlResult = true;
    let termsAndConditionsResult = true;
    let privacyPolicyResult = true;
    let testOtpResult = true;

    graphqlUrlResult = !validateFunc(
      { graphqlUrlApp: formRef.current['input-graphqlUrlApp'].value },
      'graphqlUrlApp'
    );
    wsGraphqlUrlResult = !validateFunc(
      { wsGraphqlUrlApp: formRef.current['input-wsGraphqlUrlApp'].value },
      'wsGraphqlUrlApp'
    );
    serverUrlResult = !validateFunc(
      { serverUrlApp: formRef.current['input-serverUrlApp'].value },
      'serverUrlApp'
    );
    termsAndConditionsResult = !validateFunc(
      { termsAndConditions: formRef.current['input-termsAndConditions'].value },
      'termsAndConditions'
    );
    privacyPolicyResult = !validateFunc(
      { privacyPolicy: formRef.current['input-privacyPolicy'].value },
      'privacyPolicy'
    );
    testOtpResult = !validateFunc(
      { testOtp: formRef.current['input-testOtp'].value },
      'testOtp'
    );

    setGraphqlUrlError(graphqlUrlResult);
    setWsGraphqlUrlError(wsGraphqlUrlResult);
    setServerUrlError(serverUrlResult);
    setTermsAndConditionsError(termsAndConditionsResult);
    setPrivacyPolicyError(privacyPolicyResult);
    setTestOtpError(testOtpResult);

    return (
      graphqlUrlResult &&
      wsGraphqlUrlResult &&
      serverUrlResult &&
      termsAndConditionsResult &&
      privacyPolicyResult &&
      testOtpResult
    );
  };

  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  return (
    <Box container className={classes.container}>
         <Box className={classes.flexRow}>
          <Box item className={classes.heading}>
            <Typography variant="h6" className={classes.text}>
              APP Configuration
            </Typography>
          </Box>
          
        </Box>
      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>
              GraphQL URL
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-graphqlUrlApp"
              name="input-graphqlUrlApp"
              placeholder="GraphQL URL"
              defaultValue={graphqlUrlApp}
              onBlur={(event) =>
                onBlur(setGraphqlUrlError, 'graphqlUrlApp', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                graphqlUrlError === false
                  ? globalClasses.inputError
                  : graphqlUrlError === true
                  ? globalClasses.inputSuccess
                  : '',
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                WS GraphQL URL
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-wsGraphqlUrlApp"
                name="input-wsGraphqlUrlApp"
                placeholder="WS GraphQL URL"
                defaultValue={wsGraphqlUrlApp}
                onBlur={(event) =>
                  onBlur(setWsGraphqlUrlError, 'wsGraphqlUrlApp', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  wsGraphqlUrlError === false
                    ? globalClasses.inputError
                    : wsGraphqlUrlError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                Server URL
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-serverUrlApp"
                name="input-serverUrlApp"
                placeholder="Server URL"
                defaultValue={serverUrlApp}
                onBlur={(event) =>
                  onBlur(setServerUrlError, 'serverUrlApp', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  serverUrlError === false
                    ? globalClasses.inputError
                    : serverUrlError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
            </Box>
          </Box>
          <Box>
            <Typography className={classes.labelText}>
              Terms and Conditions
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-termsAndConditions"
              name="input-termsAndConditions"
              placeholder="Terms and Conditions"
              defaultValue={termsAndConditions}
              onBlur={(event) =>
                onBlur(setTermsAndConditionsError, 'termsAndConditions', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                termsAndConditionsError === false
                  ? globalClasses.inputError
                  : termsAndConditionsError === true
                  ? globalClasses.inputSuccess
                  : '',
              ]}
            />
          </Box>
          <Box className={globalClasses.flexRow}>
            <Box>
              <Typography className={classes.labelText}>
                Privacy Policy
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-privacyPolicy"
                name="input-privacyPolicy"
                placeholder="Privacy Policy"
                defaultValue={privacyPolicy}
                onBlur={(event) =>
                  onBlur(setPrivacyPolicyError, 'privacyPolicy', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  privacyPolicyError === false
                    ? globalClasses.inputError
                    : privacyPolicyError === true
                    ? globalClasses.inputSuccess
                    : '',
                ]}
              />
            </Box>
            <Box>
              <Typography className={classes.labelText}>
                Test OTP
              </Typography>
              <Input
                style={{ marginTop: -1 }}
                id="input-testOtp"
                name="input-testOtp"
                placeholder="Test OTP"
                defaultValue={testOtp}
                onBlur={(event) =>
                  onBlur(setTestOtpError, 'testOtp', event.target.value)
                }
                disableUnderline
                className={[
                  globalClasses.input,
                  testOtpError === false
                    ? globalClasses.inputError
                    : testOtpError === true
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
                        graphqlUrlApp: formRef.current['input-graphqlUrlApp'].value,
                        wsGraphqlUrlApp: formRef.current['input-wsGraphqlUrlApp'].value,
                        serverUrlApp: formRef.current['input-serverUrlApp'].value,
                        termsAndConditions: formRef.current['input-termsAndConditions'].value,
                        privacyPolicy: formRef.current['input-privacyPolicy'].value,
                        testOtp: formRef.current['input-testOtp'].value,
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

export default withTranslation()(AppConfigurations);
