import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { patientValidationSchema } from 'validationSchema/patients';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPatients();
    case 'POST':
      return createPatient();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPatients() {
    const data = await prisma.patient
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'patient'));
    return res.status(200).json(data);
  }

  async function createPatient() {
    await patientValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.intervention?.length > 0) {
      const create_intervention = body.intervention;
      body.intervention = {
        create: create_intervention,
      };
    } else {
      delete body.intervention;
    }
    const data = await prisma.patient.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
