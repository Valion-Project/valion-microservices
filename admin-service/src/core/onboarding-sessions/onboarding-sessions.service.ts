import {BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OnboardingSession, OnboardingStatus} from "./entity/onboarding-session.entity";
import {Repository} from "typeorm";
import {CreateOnboardingSessionDto} from "./dto/create-onboarding-session.dto";
import {catchError, firstValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";
import {CompanyProgram} from "../company-programs/entity/company-programs.entity";
import {Branch} from "../branches/entity/branches.entity";
import * as QRCode from 'qrcode';

@Injectable()
export class OnboardingSessionsService {

  constructor(
    @InjectRepository(OnboardingSession) private onboardingSessionRepository: Repository<OnboardingSession>,
    @InjectRepository(CompanyProgram) private companyProgramRepository: Repository<CompanyProgram>,
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  async create(createOnboardingSessionDto: CreateOnboardingSessionDto) {
    const companyProgram = await this.companyProgramRepository.findOne({
      where: { id: createOnboardingSessionDto.companyProgramId },
      relations: ['company']
    });
    if (!companyProgram) {
      throw new BadRequestException({
        message: ['Programa de fidelidad en empresa no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const userProfileResponse = await firstValueFrom(
      this.userClient.send('find_user_profile_by_id', { id: createOnboardingSessionDto.userProfileId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Programa de fidelidad en la empresa no encontrado.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    const branch = await this.branchRepository.findOneBy({
      id: userProfileResponse.userProfile.branchId
    });
    if (!branch) {
      throw new BadRequestException({
        message: ['Sucursal no encontrada.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (userProfileResponse.userProfile.profile.domain !== "OPERATOR") {
      throw new BadRequestException({
        message: ['Usuario no es operador'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (companyProgram.company.id !== userProfileResponse.userProfile.branch.company.id) {
      throw new BadRequestException({
        message: ['Empresa del operador y programa de fidelidad diferentes'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newOnboardingSession = this.onboardingSessionRepository.create({
      quantity: createOnboardingSessionDto.quantity,
      status: OnboardingStatus.CREATED,
      operatorUserId: userProfileResponse.userProfile.user.id,
      branch: branch,
      companyProgram: companyProgram
    });
    const savedOnboardingSession = await this.onboardingSessionRepository.save(newOnboardingSession);

    const url = `${process.env.FRONT_DOMAIN}/onboarding/${savedOnboardingSession.id}`;
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return { onboardingSession: savedOnboardingSession, qrCode };
  }

  async findById(id: string) {
    const onboardingSession = await this.onboardingSessionRepository.findOne({
      where: { id },
      relations: ['companyProgram', 'companyProgram.loyaltyProgram']
    });
    if (!onboardingSession) {
      throw new NotFoundException({
        message: ['Qr de onboarding no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    if (onboardingSession.createdAt < fiveMinutesAgo) {
      throw new NotFoundException({
        message: ['Qr de onboarding expirado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { onboardingSession };
  }
}
