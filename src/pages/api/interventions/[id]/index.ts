import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { interventionValidationSchema } from 'validationSchema/interventions';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.intervention
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getInterventionById();
    case 'PUT':
      return updateInterventionById();
    case 'DELETE':
      return deleteInterventionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInterventionById() {
    const data = await prisma.intervention.findFirst(convertQueryToPrismaUtil(req.query, 'intervention'));
    return res.status(200).json(data);
  }

  async function updateInterventionById() {
    await interventionValidationSchema.validate(req.body);
    const data = await prisma.intervention.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteInterventionById() {
    const data = await prisma.intervention.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
