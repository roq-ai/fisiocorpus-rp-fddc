import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getPatients, deletePatientById } from 'apiSdk/patients';
import { PatientInterface } from 'interfaces/patient';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function PatientListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<PatientInterface[]>(
    () => '/patients',
    () =>
      getPatients({
        relations: [
          'clinic',
          'user_patient_physiotherapist_idTouser',
          'user_patient_pilates_instructor_idTouser',
          'intervention.count',
        ],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePatientById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('patient', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/patients/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('patient', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Flex justifyContent="space-between" mb={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold">
              Patient
            </Text>
            <NextLink href={`/patients/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          </Flex>
        )}
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  {hasAccess('clinic', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>clinic</Th>}
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_patient_physiotherapist_idTouser</Th>
                  )}
                  {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>user_patient_pilates_instructor_idTouser</Th>
                  )}
                  {hasAccess('intervention', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>intervention</Th>
                  )}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.name}</Td>
                    {hasAccess('clinic', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/clinics/view/${record.clinic?.id}`}>
                          {record.clinic?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_patient_physiotherapist_idTouser?.id}`}>
                          {record.user_patient_physiotherapist_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/users/view/${record.user_patient_pilates_instructor_idTouser?.id}`}>
                          {record.user_patient_pilates_instructor_idTouser?.email}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('intervention', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.intervention}</Td>
                    )}
                    <Td>
                      {hasAccess('patient', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/patients/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('patient', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'patient',
  operation: AccessOperationEnum.READ,
})(PatientListPage);
