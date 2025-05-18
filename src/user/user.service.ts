import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Users, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name, 'users') private usersModel: Model<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const { first_name, last_name, ...rest } = createUserDto;
      const name = `${first_name} ${last_name}`.trim();
      const createdUser = new this.usersModel({ ...rest, name });
      return await createdUser.save();
    } catch (error) {
      // Log error or handle it accordingly
      throw error;
    }
  }

  async findByEmailId(email: string): Promise<Users | null> {
    return this.usersModel.findOne({ email: email }).exec();
  }
}
