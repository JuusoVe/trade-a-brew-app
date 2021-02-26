import React, { useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Container, Grid, Button, FormLabel,
} from '@material-ui/core';
import {
  Formik, FormikHelpers, FormikProps, Form, Field,
} from 'formik';
import { RadioGroup } from 'material-ui-formik-components';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import FormTextField from '../../SharedComponents/FormTextField';
import LocationField from '../../SharedComponents/LocationField';
import FormSlider from '../../SharedComponents/FormSlider';
import { RootState } from '../../rootReducer';
import { setDrawerOpen } from '../../Display/displaySlice';
import { AppThunk, useAsyncDispatch } from '../../store';
import { OfferFormValues } from '../../type';
import TitleBox from '../../SharedComponents/TitleBox';
import ImageUploader from '../../SharedComponents/ImageUploader';
import ImageDisplay from '../../SharedComponents/ImageDisplay';

interface OfferFormProps {
  formTitle: string;
  initValues: OfferFormValues;
  actionOnSubmit: (formValues: OfferFormValues) => AppThunk;
  buttonText: string;
}

const useStyles = makeStyles(() => createStyles({
  formContainer: {
    height: '100%',
  },
}));

const validationSchema = yup.object().shape({
  beerName: yup.string().required('A name is required').min(3).max(40),
  description: yup.string().required('Required').min(6).max(1200),
  location: yup.string().required('A valid location is necessary to display the offer on the map'),
});

const EditOfferForm: React.FC<OfferFormProps> = (props) => {
  const {
    formTitle, initValues, actionOnSubmit, buttonText,
  } = props;

  const classes = useStyles();

  const dispatch = useAsyncDispatch();

  const isLoaded = useSelector(
    (state: RootState) => state.display.mapsLoaded,
  );

  const imgUrl = useSelector(
    (state: RootState) => state.display.offerUploadUrl,
  );

  useEffect(() => {
    dispatch(setDrawerOpen(true));
    return () => {
      dispatch(setDrawerOpen(false));
    };
  }, [dispatch]);

  return (
    <Container className={classes.formContainer}>
      <TitleBox title={formTitle} />
      <Formik
        initialValues={initValues}
        validationSchema={validationSchema}
        onSubmit={(
          values: OfferFormValues,
          formikHelpers: FormikHelpers<OfferFormValues>,
        ) => {
          dispatch(actionOnSubmit(values));
          formikHelpers.setSubmitting(false);
        }}
      >
        {(formikProps: FormikProps<OfferFormValues>) => (
          <Form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  name="beerName"
                  label="What do you call it?"
                  size="small"
                  component={FormTextField}
                  fullWidth
                  initHelperText="This name will be displayed on the map"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="description"
                  label="A few words about your brew"
                  size="small"
                  component={FormTextField}
                  fullWidth
                  initHelperText="The level of detail is up to you"
                  multiline
                  rows="6"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  label="Package Size"
                  component={RadioGroup}
                  name="packageSize"
                  options={[
                    { value: '0.33', label: '0.33' },
                    { value: '0.5', label: '0.5' },
                    { value: 'other', label: 'other' },
                  ]}
                  groupProps={{ row: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Amount</FormLabel>
                <Field
                  component={FormSlider}
                  name="amount"
                  defaultValue={2}
                  step={1}
                  marks
                  min={1}
                  max={12}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                {isLoaded
                  ? (
                    <Field
                      name="location"
                      label="Trade location"
                      component={LocationField}
                      fullWidth
                      initHelperText="Give a default location for the trade. Any public location will do."
                    />
                  )
                  : 'loading maps'}
              </Grid>
              <Grid item xs={12}>
                <ImageUploader />
              </Grid>
              <Grid item xs={12}>
                <ImageDisplay url={imgUrl} />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="recipeLink"
                  label="Link to recipe/brewing notes"
                  size="small"
                  component={FormTextField}
                  fullWidth
                  initHelperText="optional"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="outlined"
                  size="large"
                  color="primary"
                  disabled={formikProps.isSubmitting}
                  fullWidth
                >
                  {buttonText}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EditOfferForm;
