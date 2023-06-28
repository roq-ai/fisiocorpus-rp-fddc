import * as yup from 'yup';

export const patientValidationSchema = yup.object().shape({
  name: yup.string().required(),
  clinic_id: yup.string().nullable(),
  physiotherapist_id: yup.string().nullable(),
  pilates_instructor_id: yup.string().nullable(),
});
