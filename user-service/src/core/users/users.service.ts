import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entity/users.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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
