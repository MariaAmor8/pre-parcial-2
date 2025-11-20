/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// Custom validator to check if fechaFin is after fechaInicio
function IsAfterDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) {
            return true;
          }

          const startDate = new Date(relatedValue);
          const endDate = new Date(value);

          return endDate > startDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser posterior a ${args.constraints[0]}`;
        },
      },
    });
  };
}

export class CreateTravelPlanDto {
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsDateString(
    {},
    {
      message:
        'fechaInicio debe tener un formato de fecha válido (ISO 8601: YYYY-MM-DD)',
    },
  )
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  fechaInicio: string;

  @IsDateString(
    {},
    {
      message:
        'fechaFin debe tener un formato de fecha válido (ISO 8601: YYYY-MM-DD)',
    },
  )
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
  @IsAfterDate('fechaInicio', {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  })
  fechaFin: string;

  @IsOptional()
  comentarios?: string;

  @IsString({ message: 'El país debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El país es obligatorio' })
  pais: string;
}
