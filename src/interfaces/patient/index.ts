import { InterventionInterface } from 'interfaces/intervention';
import { ClinicInterface } from 'interfaces/clinic';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PatientInterface {
  id?: string;
  name: string;
  clinic_id?: string;
  physiotherapist_id?: string;
  pilates_instructor_id?: string;
  created_at?: any;
  updated_at?: any;
  intervention?: InterventionInterface[];
  clinic?: ClinicInterface;
  user_patient_physiotherapist_idTouser?: UserInterface;
  user_patient_pilates_instructor_idTouser?: UserInterface;
  _count?: {
    intervention?: number;
  };
}

export interface PatientGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  clinic_id?: string;
  physiotherapist_id?: string;
  pilates_instructor_id?: string;
}
