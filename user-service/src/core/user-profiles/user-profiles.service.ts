import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserProfile} from "./entity/user-profiles.entity";
import {DataSource, Repository} from "typeorm";
import {User} from "../users/entity/users.entity";
import {Profile, ProfileDomain} from "../profiles/entity/profiles.entity";
import {ClientProxy} from "@nestjs/microservices";
import {CreateUserProfileDto} from "./dto/create-user-profile.dto";
import {catchError, firstValueFrom, of} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {CreateUserProfileAndUserDto} from "./dto/create-user-profile-and-user.dto";
import * as bcrypt from "bcrypt";
import {PermissionDomain} from "../permissions/entity/permissions.entity";
import {UpdateUserProfileDto} from "./dto/update-user-profile.dto";

@Injectable()
export class UserProfilesService {

  constructor(
    @InjectRepository(UserProfile) private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @Inject('ADMIN_SERVICE') private adminClient: ClientProxy,
    @Inject('POINT_SERVICE') private pointClient: ClientProxy,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto) {
    const userProfileExisting = await this.userProfileRepository.findOneBy({
      user: { id: createUserProfileDto.userId },
      profile: { id: createUserProfileDto.profileId },
    });
    if (userProfileExisting) {
      throw new BadRequestException({
        message: ['Perfil en usuario ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const user = await this.userRepository.findOneBy({
      id: createUserProfileDto.userId
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const profile = await this.profileRepository.findOne({
      where: { id: createUserProfileDto.profileId },
      relations: ['profilePermissions', 'profilePermissions.permission']
    });
    if (!profile) {
      throw new BadRequestException({
        message: ['Perfil no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (createUserProfileDto.branchId !== null && createUserProfileDto.branchId !== 0) {
      const branchResponse = await firstValueFrom(
        this.adminClient.send('find_branch_by_id', { id: createUserProfileDto.branchId }).pipe(
          catchError(err => {
            if (err.statusCode === 404) {
              throw new BadRequestException({
                message: ['Sucursal no encontrada.'],
                error: 'Bad Request',
                statusCode: 400
              });
            }
            throw new InternalServerErrorException();
          })
        )
      );

      if (branchResponse.branch.company.id !== profile.companyId) {
        throw new BadRequestException({
          message: ['Sucursal incorrecta para el perfil seleccionado.'],
          error: 'Bad Request',
          statusCode: 400
        })
      }
    }

    if (profile.domain == null) {
      throw new BadRequestException({
        message: ['El perfil seleccionado debe tener permisos asignados.'],
        error: 'Bad Request',
        statusCode: 400
      });
    } else if (profile.domain === ProfileDomain.OPERATOR) {
      if (createUserProfileDto.branchId == null || createUserProfileDto.branchId === 0) {
        throw new BadRequestException({
          message: ['Debe seleccionarse una sucursal.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
    } else {
      const existingPermissionDomains = profile.profilePermissions.map(pp => pp.permission.domain);
      const hasAdminPermissions = existingPermissionDomains.includes(PermissionDomain.ADMIN);
      const hasBranchPermissions = existingPermissionDomains.includes(PermissionDomain.BRANCH);
      if (hasBranchPermissions && (createUserProfileDto.branchId == null || createUserProfileDto.branchId === 0)) {
        throw new BadRequestException({
          message: ['Debe seleccionarse una sucursal.'],
          error: "Bad Request",
          statusCode: 400
        });
      } else if (hasAdminPermissions && createUserProfileDto.branchId !== null && createUserProfileDto.branchId !== 0) {
        throw new BadRequestException({
          message: ['El perfil seleccionado no permite seleccionar una sucursal.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
    }

    const newUserProfile = this.userProfileRepository.create({
      user: user,
      profile: profile,
      ...(createUserProfileDto.branchId != null && createUserProfileDto.branchId !== 0 ? { branchId: createUserProfileDto.branchId } : {})
    });
    const savedUserProfile = await this.userProfileRepository.save(newUserProfile);

    return { userProfile: savedUserProfile };
  }

  async createUserProfileAndUser(createUserProfileAndUserDto: CreateUserProfileAndUserDto) {
    const profile = await this.profileRepository.findOne({
      where: { id: createUserProfileAndUserDto.profileId },
      relations: ['profilePermissions', 'profilePermissions.permission']
    });
    if (!profile) {
      throw new BadRequestException({
        message: ['Perfil no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    if (createUserProfileAndUserDto.branchId !== null && createUserProfileAndUserDto.branchId !== 0) {
      const branchResponse = await firstValueFrom(
        this.adminClient.send('find_branch_by_id', { id: createUserProfileAndUserDto.branchId }).pipe(
          catchError(err => {
            if (err.statusCode === 404) {
              throw new BadRequestException({
                message: ['Sucursal no encontrada.'],
                error: 'Bad Request',
                statusCode: 400
              });
            }
            throw new InternalServerErrorException();
          })
        )
      );

      if (branchResponse.branch.company.id !== profile.companyId) {
        throw new BadRequestException({
          message: ['Sucursal incorrecta para el perfil seleccionado.'],
          error: 'Bad Request',
          statusCode: 400
        })
      }
    }

    if (profile.domain == null) {
      throw new BadRequestException({
        message: ['El perfil seleccionado debe tener permisos asignados.'],
        error: 'Bad Request',
        statusCode: 400
      });
    } else if (profile.domain === ProfileDomain.OPERATOR) {
      if (createUserProfileAndUserDto.branchId == null || createUserProfileAndUserDto.branchId === 0) {
        throw new BadRequestException({
          message: ['Debe seleccionarse una sucursal.'],
          error: "Bad Request",
          statusCode: 400
        });
      }
    } else {
      const existingPermissionDomains = profile.profilePermissions.map(pp => pp.permission.domain);
      const hasAdminPermissions = existingPermissionDomains.includes(PermissionDomain.ADMIN);
      const hasBranchPermissions = existingPermissionDomains.includes(PermissionDomain.BRANCH);
      if (hasBranchPermissions && (createUserProfileAndUserDto.branchId == null || createUserProfileAndUserDto.branchId === 0)) {
        throw new BadRequestException({
          message: ['Debe seleccionarse una sucursal.'],
          error: "Bad Request",
          statusCode: 400
        });
      } else if (hasAdminPermissions && createUserProfileAndUserDto.branchId !== null && createUserProfileAndUserDto.branchId !== 0) {
        throw new BadRequestException({
          message: ['El perfil seleccionado no permite seleccionar una sucursal.'],
          error: "Bad Request",
          statusCode: 400
        })
      }
    }

    const userExisting = await this.userRepository.findOneBy({
      email: createUserProfileAndUserDto.user.email
    });
    if (userExisting) {
      const userProfileExisting = await this.userProfileRepository.findOneBy({
        user: { id: userExisting.id },
        profile: { id: createUserProfileAndUserDto.profileId },
      });
      if (userProfileExisting) {
        throw new BadRequestException({
          message: ['Perfil en usuario ya existente.'],
          error: "Bad Request",
          statusCode: 400
        });
      }

      const newUserProfile = this.userProfileRepository.create({
        user: userExisting,
        profile: profile,
        ...(createUserProfileAndUserDto.branchId != null && createUserProfileAndUserDto.branchId !== 0 ? { branchId: createUserProfileAndUserDto.branchId } : {})
      });
      const savedUserProfile = await this.userProfileRepository.save(newUserProfile);

      return { userProfile: savedUserProfile };
    } else {
      const hashedPassword = await bcrypt.hash(createUserProfileAndUserDto.user.password, 10);

      const savedUserProfile = await this.dataSource.transaction(async manager => {
        const userRepository = manager.getRepository(User);
        const userProfileRepository = manager.getRepository(UserProfile);

        const newUser = userRepository.create({
          name: createUserProfileAndUserDto.user.name,
          lastName: createUserProfileAndUserDto.user.lastName,
          email: createUserProfileAndUserDto.user.email,
          password: hashedPassword,
          tokenVersion: 1,
          isSuperAdmin: false
        });
        const savedUser = await userRepository.save(newUser);

        const newUserProfile = userProfileRepository.create({
          user: savedUser,
          profile: profile,
          ...(createUserProfileAndUserDto.branchId != null && createUserProfileAndUserDto.branchId !== 0 ? { branchId: createUserProfileAndUserDto.branchId } : {})
        });
        const savedUserProfile = await userProfileRepository.save(newUserProfile);

        return { userProfile: savedUserProfile };
      });

      return { userProfile: savedUserProfile.userProfile };
    }
  }

  async findContextOptions(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const clientResponse = await firstValueFrom(
      this.pointClient.send('find_client_by_user_id', { userId: userId }).pipe(
        catchError((err) => {
          if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            throw new InternalServerErrorException({
              message: ['Ocurrió un error en su petición.'],
              error: 'Internal Server Error:',
              statusCode: 500
            });
          }
          return of(null);
        })
      )
    );

    const userProfiles = await this.userProfileRepository.find({
      where: { user: { id: userId } },
      relations: ['profile']
    });

    const response: { superadmin: boolean, client: boolean, companies: { id: number, name: string, profiles: { id: number, name: string, domain: string, branchName: string }[] }[] } = {
      superadmin: user.isSuperAdmin,
      client: clientResponse?.client != null,
      companies: []
    };

    const empresaMap = new Map<number, { id: number, name: string, profiles: { id: number, name: string, domain: string, branchName: string }[] }>();

    for (const userProfile of userProfiles) {
      const companyResponse = await firstValueFrom(
        this.adminClient.send('find_company_by_id', { id: userProfile.profile.companyId }).pipe(
          catchError(err => {
            if (err.statusCode === 404) {
              throw new NotFoundException({
                message: ['Empresa no encontrada.'],
                error: 'Bad Request',
                statusCode: 400
              });
            }
            throw new InternalServerErrorException();
          })
        )
      );

      let branchName = "";

      if (userProfile.branchId) {
        const branchResponse = await firstValueFrom(
          this.adminClient.send('find_branch_by_id', { id: userProfile.branchId }).pipe(
            catchError(err => {
              if (err.statusCode === 404) {
                throw new NotFoundException({
                  message: ['Sucursal no encontrada.'],
                  error: 'Bad Request',
                  statusCode: 400
                });
              }
              throw new InternalServerErrorException();
            })
          )
        );

        branchName = branchResponse.branch.name;
      }

      if (!empresaMap.has(userProfile.profile.companyId)) {
        empresaMap.set(userProfile.profile.companyId, {
          id: userProfile.profile.companyId,
          name: companyResponse.company.name,
          profiles: []
        });
      }

      const empresaEntry = empresaMap.get(userProfile.profile.companyId);

      if (empresaEntry) {
        const profileEntry = empresaEntry.profiles.find(p => p.id === userProfile.profile.id);

        if (!profileEntry) {
          const newProfileEntry = {
            id: userProfile.id,
            name: userProfile.profile.name,
            domain: userProfile.profile.domain,
            branchName: branchName
          };

          empresaEntry.profiles.push(newProfileEntry);
        }
      }
    }

    response.companies = Array.from(empresaMap.values());

    return { contextOptions: response };
  }

  async generateProfileToken(userId: number, type: string, userProfileId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    let payload = {
      sub: user.id,
      tokenVersion: user.tokenVersion,
      type: type,
      userProfileId: 0
    }

    if (type === 'ADMIN' || type === 'OPERATOR') {
      const userProfile = await this.userProfileRepository.findOne({
        where: { id: userProfileId },
        relations: ['profile']
      });
      if (!userProfile) {
        throw new NotFoundException({
          message: ['Perfil de usuario no encontrado.'],
          error: 'Not Found',
          statusCode: 404
        });
      }

      payload.userProfileId = userProfileId;
    }

    const token = this.jwtService.sign(payload);

    return { token };
  }

  async validateProfileToken(userId: number, type: string, userProfileId: number) {
    if (type !== 'SUPERADMIN' && type !== 'ADMIN' && type !== 'OPERATOR' && type !== 'CLIENT') {
      throw new UnauthorizedException({
        message: ['No tienes permiso para acceder a este recurso.'],
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    if (type === 'ADMIN' || type === 'OPERATOR') {
      const userProfile = await this.userProfileRepository.findOne({
        where: { id: userProfileId, user: { id: userId } },
        relations: ['profile', 'profile.profilePermissions', 'profile.profilePermissions.permission']
      });
      if (!userProfile) {
        throw new UnauthorizedException({
          message: ['No tienes permiso para acceder a este recurso.'],
          error: 'Unauthorized',
          statusCode: 401
        });
      }

      return {
        success: true,
        type,
        userProfile
      }
    }

    return {
      success: true,
      type
    }
  }

  async findUserProfileAvailabilityInProfiles(companyId: number, userId: number) {
    const profiles = await this.profileRepository.find({
      where: { companyId },
      relations: ['profilePermissions', 'profilePermissions.permission']
    });
    const user = await this.userRepository.findOneBy({
      id: userId
    });

    const userProfiles: UserProfile[] = [];

    for (const profile of profiles) {
      const userProfile = await this.userProfileRepository.findOne({
        where: { user: { id: userId }, profile: { id: profile.id } },
        relations: ['profile', 'profile.profilePermissions', 'profile.profilePermissions.permission', 'user']
      });
      if (userProfile) {
        userProfiles.push(userProfile);
      } else {
        const userProfile = {
          user: user,
          profile: profile
        } as UserProfile;
        userProfiles.push(userProfile);
      }
    }

    return { userProfiles };
  }

  async findById(id: number) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id },
      relations: ['profile', 'profile.profilePermissions', 'profile.profilePermissions.permission', 'user']
    });
    if (!userProfile) {
      throw new NotFoundException({
        message: ['Perfil de usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      })
    }

    return { userProfile };
  }

  async updateById(id: number, updateUserProfileDto: UpdateUserProfileDto) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id },
      relations: ['profile']
    });
    if (!userProfile) {
      throw new NotFoundException({
        message: ['Perfil de usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      })
    }

    const branchResponse = await firstValueFrom(
      this.adminClient.send('find_branch_by_id', { id: updateUserProfileDto.branchId }).pipe(
        catchError(err => {
          if (err.statusCode === 404) {
            throw new BadRequestException({
              message: ['Sucursal no encontrada.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
          throw new InternalServerErrorException();
        })
      )
    );

    if (branchResponse.branch.company.id !== userProfile.profile.companyId) {
      throw new BadRequestException({
        message: ['Sucursal incorrecta para el perfil seleccionado.'],
        error: 'Bad Request',
        statusCode: 400
      })
    }

    await this.userProfileRepository.update(id, updateUserProfileDto);

    return this.findById(id);
  }
}
