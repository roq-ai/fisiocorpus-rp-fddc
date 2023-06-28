import * as yup from 'yup';

export const interventionValidationSchema = yup.object().shape({
  description: yup.string().required(),
  patient_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
