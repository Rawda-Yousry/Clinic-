import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';;

const prisma = new PrismaClient();

//-----------------------Create Patient --------------------------------

export const createPatient = async (req: Request, res: Response) => {
  const patientData = req.body;
  try {
    if(patientData.role=="Patient"){
    const newPatient = await prisma.user.create({
      data: {
        ...patientData,
      },
    });
    res.status(201).json({ data: newPatient });
  }else{
    res.status(404).json({ error: "unmatched data" }); 
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

//-----------------------Update Patient --------------------------------

export const updatePatient = async (req: Request, res: Response) => {
  const { userID } = req.params;
  const patientData = req.body;

  try {
    const updatedPatient = await prisma.user.update({
      where: {
        userId: parseInt(userID),
        role: 'Patient',
      },
      data: {
        ...patientData,
        role: 'Patient',
      }
    });

    res.status(200).json({ data: updatedPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

//-----------------------Get Patient By ID --------------------------------

export const getPatientById = async (req: Request, res: Response) => {
  const { userID } = req.params;
  console.log(userID);
  try {
    const patient = await prisma.user.findUnique({
      where: {
        userId: parseInt(userID),
        role: 'Patient',
      }
    });

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
    } else {
      res.status(200).json({ data: patient });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};


//-----------------------Delete Patient --------------------------------

export const deletePatient = async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    await prisma.user.delete({
      where: {
        userId: parseInt(userID),
        role: 'Patient',
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

