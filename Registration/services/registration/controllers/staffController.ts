import { error } from 'console';
import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//-------------------Get All staff -----------------------

export const getAllstaff = async (req: Request, res: Response) => {

    try {
      const roleMembers = await prisma.user.findMany({
        where: {
          OR: [
            { role: "Doctor" },
            { role: "Admin" }
          ]
        }
      });
  
      res.status(200).json({ data: roleMembers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };

//-------------------Get  all staff User By ID-----------------------
export const getALLStaffById = async (req: Request, res: Response) => {
//   const getALLStaffById = async (req, res) => {
  const {userID } = req.params;
  try {
    console.log(userID);
    const userMember = await prisma.user.findUnique({
      where: {
        userId: parseInt(userID,10),
        OR: [
          { role: "Doctor" },
          { role: "Admin" }
        ]
      }
    });

    if (userMember) {
      res.status(200).json({ data: userMember });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};
//-------------------Get  all docotrs By clinicID-----------------------
export const getDoctorsByClinicID  = async (req: Request, res: Response) => {
//   const getDoctorsByClinicID = async (req, res) => {
    const {clinicID } = req.params;
    try {
      const userMember = await prisma.user.findMany({
        where: {
          clinicId : parseInt(clinicID),
          role: "Doctor",
        },
      });
      if ( (userMember.length === 0)) {
        res.status(404).json({ error: 'Invalid clinic  id' });
      } else {
        res.status(200).json({ data: userMember });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  };
//-------------------Create New Staff -----------------------
export const createStaff = async (req: Request, res: Response) => {

  const userData = req.body;

  try {
    if(userData.role=="Doctor" || userData.role=="Admin"){
      const newUser = await prisma.user.create({
        data: userData,
      });
      res.status(201).json({ data: newUser });
    }else{
      // console.log(error);
      res.status(404).json({ error: 'unmatched data' });
      
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    // res.status(500).json({message: error.message});
    
  } finally {
    await prisma.$disconnect();
  }
};

//-------------------Update staff-----------------------
export const updateStaff = async (req: Request, res: Response) => {
//   const updateUser = async (req, res) => {
  const { userID } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        userId: parseInt(userID),
       
      },
      
      data: userData,
    });
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};


//-------------------Delete Staff -----------------------
export const deleteStaff = async (req: Request, res: Response) => {
//  const deleteUser = async (req, res) => {
  const { userID } = req.params;

  try {
    await prisma.user.delete({
      where: {
        userId: parseInt(userID, 10),
        OR: [
          { role: "Doctor" },
          { role: "Admin" }
        ]
      }
    });

    res.status(204).send(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

