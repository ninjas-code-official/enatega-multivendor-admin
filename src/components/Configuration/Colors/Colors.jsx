// ColorConfiguration.js
import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useMutation, gql } from '@apollo/client';
import { validateFunc } from '../../../constraints/constraints';
import { saveColorConfiguration } from '../../../apollo/mutations'; // Update with the correct import path
import useStyles from '../styles';
import useGlobalStyles from '../../../utils/globalStyles';
import { Box, Typography, Input, Button,} from '@mui/material';


const SAVE_COLOR_CONFIGURATION = gql`
  ${saveColorConfiguration}
`;

function ColorConfiguration(props) {
  const formRef = useRef();

  const [primaryColor] = useState(props.primaryColor || '');
  const [secondaryColor] = useState(props.secondaryColor || '');
  const [tertiaryColor] = useState(props.tertiaryColor || '');

  const [primaryColorError, setPrimaryColorError] = useState(null);
  const [secondaryColorError, setSecondaryColorError] = useState(null);
  const [tertiaryColorError, setTertiaryColorError] = useState(null);

  const [mutate, { loading }] = useMutation(SAVE_COLOR_CONFIGURATION);

  const onBlur = (setter, field, state) => {
    setter(!validateFunc({ [field]: state }, field));
  };

  const validateInput = () => {
    let primaryColorResult = true;
    let secondaryColorResult = true;
    let tertiaryColorResult = true;

    primaryColorResult = !validateFunc(
      { primaryColor: formRef.current['input-primaryColor'].value },
      'primaryColor'
    );
    secondaryColorResult = !validateFunc(
      { secondaryColor: formRef.current['input-secondaryColor'].value },
      'secondaryColor'
    );
    tertiaryColorResult = !validateFunc(
      { tertiaryColor: formRef.current['input-tertiaryColor'].value },
      'tertiaryColor'
    );

    setPrimaryColorError(primaryColorResult);
    setSecondaryColorError(secondaryColorResult);
    setTertiaryColorError(tertiaryColorResult);

    return primaryColorResult && secondaryColorResult && tertiaryColorResult;
  };

  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            Color Configuration
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form ref={formRef}>
          <Box>
            <Typography className={classes.labelText}>Primary Color</Typography>
            <Input
              style={{ marginTop: -1 }}
              type="color"
              id="input-primaryColor"
              name="input-primaryColor"
              placeholder="Primary Color"
              defaultValue={primaryColor}
              onBlur={(event) =>
                onBlur(setPrimaryColorError, 'primaryColor', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                primaryColorError === false
                  ? globalClasses.inputError
                  : primaryColorError === true
                  ? globalClasses.inputSuccess
                  : '',
              ]}
            />
          </Box>

          <Box>
            <Typography className={classes.labelText}>Secondary Color</Typography>
            <Input
              style={{ marginTop: -1 }}
              type="color"
              id="input-secondaryColor"
              name="input-secondaryColor"
              placeholder="Secondary Color"
              defaultValue={secondaryColor}
              onBlur={(event) =>
                onBlur(setSecondaryColorError, 'secondaryColor', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                secondaryColorError === false
                  ? globalClasses.inputError
                  : secondaryColorError === true
                  ? globalClasses.inputSuccess
                  : '',
              ]}
            />
          </Box>

          <Box>
            <Typography className={classes.labelText}>Tertiary Color</Typography>
            <Input
               type="color"
              style={{ marginTop: -1 }}
              id="input-tertiaryColor"
              name="input-tertiaryColor"
              placeholder="Tertiary Color"
              defaultValue={tertiaryColor}
              onBlur={(event) =>
                onBlur(setTertiaryColorError, 'tertiaryColor', event.target.value)
              }
              disableUnderline
              className={[
                globalClasses.input,
                tertiaryColorError === false
                  ? globalClasses.inputError
                  : tertiaryColorError === true
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
                        primaryColor: formRef.current['input-primaryColor'].value,
                        secondaryColor: formRef.current['input-secondaryColor'].value,
                        tertiaryColor: formRef.current['input-tertiaryColor'].value,
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

export default withTranslation()(ColorConfiguration);
