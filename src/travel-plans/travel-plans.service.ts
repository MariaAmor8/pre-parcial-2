import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TravelPlan, TravelPlanDocument } from './schemas/travel-plan.schema';
import { Model } from 'mongoose';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectModel(TravelPlan.name)
    private readonly travelPlanModel: Model<TravelPlanDocument>,
    private readonly countriesService: CountriesService,
  ) {}

  async create(createTravelPlanDto: CreateTravelPlanDto) {
    const { titulo, fechaInicio, fechaFin, comentarios, pais } =
      createTravelPlanDto;

    // Convertir strings a Date objects
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // Validación adicional: fechaFin debe ser después de fechaInicio
    if (fechaFinDate <= fechaInicioDate) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    // verificar que el país existe usando el CountriesService
    const countryDoc = await this.countriesService.findOne(pais);

    return this.travelPlanModel.create({
      titulo: titulo.trim(),
      fechaInicio: fechaInicioDate,
      fechaFin: fechaFinDate,
      comentarios: comentarios || [],
      pais: countryDoc._id,
    });
  }

  findAll() {
    return this.travelPlanModel.find().populate('pais').exec();
  }

  findOne(id: string) {
    return this.travelPlanModel.findById(id).populate('pais').exec();
  }

  async addComment(id: string, descripcion: string) {
    const travelPlan = await this.travelPlanModel.findById(id);
    if (!travelPlan) {
      throw new BadRequestException('Plan de viaje no encontrado');
    }
    travelPlan.comentarios.push({ descripcion: descripcion.trim() });
    return travelPlan.save();
  }

  async findComment(planId: string, commentId: string) {
    const travelPlan = await this.travelPlanModel.findById(planId).exec();
    if (!travelPlan) {
      throw new BadRequestException('Plan de viaje no encontrado');
    }

    // Buscar el comentario por su _id en el array
    const comment = travelPlan.comentarios.find(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (c: any) => c._id?.toString() === commentId,
    );

    if (!comment) {
      throw new BadRequestException('Comentario no encontrado');
    }

    return comment;
  }
}
