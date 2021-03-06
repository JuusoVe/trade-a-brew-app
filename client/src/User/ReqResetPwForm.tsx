import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import {
  Formik, FormikHelpers, FormikProps, Form, Field,
} from 'formik';
import * as yup from 'yup';
import Container from '@material-ui/core/Container';
import FormTextField from '../SharedComponents/FormTextField';
import { reqResetPw } from './userSlice';
import { useAsyncDispatch } from '../store';
import TitleBox from '../SharedComponents/TitleBox';
import { ReqResetPwFormValues } from '../type';

const validationSchema = yup.object().shape({
  email: yup.string().required('Please provide a valid email')
    .email('Please provide a valid email'),
});

const ReqResetPwForm: React.FC = () => {
  const [showResetForm, setShowResetForm] = useState(true);

  const handleClick = () => setShowResetForm(false);

  const dispatch = useAsyncDispatch();

  return (
    <Container>
      <TitleBox title="Forgot password?" />
      {showResetForm
        ? (
          <Button
            id="showPwResetFormButton"
            onClick={handleClick}
            variant="outlined"
            size="large"
            color="primary"
            fullWidth
          >
            Reset password
          </Button>
        )
        : (
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(
              values: ReqResetPwFormValues,
              formikHelpers: FormikHelpers<ReqResetPwFormValues>,
            ) => {
              dispatch(reqResetPw(values));
              formikHelpers.setSubmitting(false);
            }}
          >
            {(formikProps: FormikProps<ReqResetPwFormValues>) => (
              <Form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      id="resetPwEmailField"
                      name="email"
                      label="Email"
                      size="small"
                      component={FormTextField}
                      fullWidth
                      initHelperText="Email to reset password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      id="sendPwResetReqButton"
                      type="submit"
                      variant="outlined"
                      size="large"
                      color="primary"
                      disabled={formikProps.isSubmitting}
                      fullWidth
                    >
                      send password reset
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
    </Container>
  );
};

export default ReqResetPwForm;
