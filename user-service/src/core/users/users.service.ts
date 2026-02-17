import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entity/users.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExisting = await this.userRepository.findOneBy({
      email: createUserDto.email
    });
    if (userExisting) {
      throw new BadRequestException({
        message: ['Usuario ya existente.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
      tokenVersion: 1,
      isSuperAdmin: false
    });
    const savedUser = await this.userRepository.save(newUser);

    return { user: savedUser };
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { user };
  }

  async findByIdToValidateToken(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { user };
  }
}
