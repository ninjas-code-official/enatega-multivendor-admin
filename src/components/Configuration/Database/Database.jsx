// DatabaseConfiguration.jsx

import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useMutation, gql } from '@apollo/client';
import { validateFunc } from '../../../constraints/constraints';
import { saveDatabaseConfiguration } from '../../../apollo'; 
import useStyles from '../styles';
import useGlobalStyles from '../../../utils/globalStyles';
import { Box,  Typography, Input, Button } from '@mui/material';

const SAVE_DATABASE_CONFIGURATION = gql`
  ${saveDatabaseConfiguration}
`;

function DatabaseConfiguration(props) {
  const formRef = useRef();
 
  const [connectionString] = useState(props.connectionString || '');

  const [connectionStringError, setConnectionStringError] = useState(null);

  const [mutate, { loading }] = useMutation(SAVE_DATABASE_CONFIGURATION);

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field));
  };

  const validateInput = () => {
    let connectionStringResult = true;

    connectionStringResult = !validateFunc(
      { connectionString: formRef.current['input-connectionString'].value },
      'connectionString'
    );

    setConnectionStringError(connectionStringResult);

    return connectionStringResult;
  };

  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Database
          </Typography>
        </Box>
     
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box >
          <Typography className={classes.labelText}>
          Database Connection String
            </Typography>
            <Input
            style={{ marginTop: -1 }}
              id="input-connectionString"
              name="input-connectionString"
              placeholder="Database Connection String"
              defaultValue={connectionString}
              onBlur={(event) =>
                onBlur(setConnectionStringError, 'connectionString', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                connectionStringError === false
                  ? globalClasses.inputError
                  : connectionStringError === true
                  ? globalClasses.inputSuccess
                  : '',
              ]}
            />
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
                        connectionString: formRef.current['input-connectionString'].value,
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

export default withTranslation()(DatabaseConfiguration);
