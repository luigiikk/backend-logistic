import { prisma } from "@/lib/prisma.js";
import { Prisma } from "@prisma/client";



export class PrismaAddresRepository {
  async create(data: Prisma.AddresCreateInput){
    const addres = await prisma.addres.create({
      data,
    });

    return addres;
  }

  async getAllAddres(){
    const addres = await prisma.addres.findMany();
    
    const listAddres = addres.map(({ country, state, city, street, number, zipcode, complement,  }) => ({
      country,
      state,
      city,
      street,
      number,
      zipcode,
      complement
    }));

    return listAddres;
  }
  
  async getAddres(id: number){
    const addres = await prisma.addres.findUnique({
      where: {
        id,
      }
    });

    return addres;
  }

  async deleteAddres(id: number){
    await prisma.addres.delete({
      where: {
        id,
      }
    })
  }

  async updateAddres(id: number, data: Prisma.AddresUpdateInput) {
    const addresExists = await prisma.addres.findUnique({ where: { id } });
    if (!addresExists) {
      throw new Error('addres not found');
    }
    return await prisma.addres.update({
      where: { id }, 
      data,            
    });
  }
}