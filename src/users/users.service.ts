import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException('user Aready exists');

    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('inalid id');
    const user = await this.userModel.findById(id);

    if (!user) throw new BadRequestException('user not found');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('inalid id');
    const updateduser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    if (!updateduser) throw new BadRequestException('not found');

    return updateduser;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('inalid id');
    const deleteduser = await this.userModel.findByIdAndDelete(id);
    if (!deleteduser) throw new BadRequestException('user not found');

    return deleteduser;
  }

  async addexpense(userId, expensesId) {
    const updateduser = await this.userModel.findByIdAndUpdate(userId, {
      $push: { expenses: expensesId },
    });

    return updateduser;
  }
}
