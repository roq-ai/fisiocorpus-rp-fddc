import axios from 'axios';
import queryString from 'query-string';
import { InterventionInterface, InterventionGetQueryInterface } from 'interfaces/intervention';
import { GetQueryInterface } from '../../interfaces';

export const getInterventions = async (query?: InterventionGetQueryInterface) => {
  const response = await axios.get(`/api/interventions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createIntervention = async (intervention: InterventionInterface) => {
  const response = await axios.post('/api/interventions', intervention);
  return response.data;
};

export const updateInterventionById = async (id: string, intervention: InterventionInterface) => {
  const response = await axios.put(`/api/interventions/${id}`, intervention);
  return response.data;
};

export const getInterventionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/interventions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInterventionById = async (id: string) => {
  const response = await axios.delete(`/api/interventions/${id}`);
  return response.data;
};
