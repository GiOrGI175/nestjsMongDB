import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    const count = await this.userModel.countDocuments();
    console.log(count);

    if (count === 11) {
      const userist = [];
      for (let i = 0; i < 30_000; i++) {
        const user = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          age: faker.number.int({ min: 18, max: 100 }),
        };
        userist.push(user);
      }
      await this.userModel.insertMany(userist);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException('user Aready exists');

    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll({ page, take }: QueryParamsDto) {
    const limit = Math.min(take, 30);

    return this.userModel
      .find()
      .skip((page - 1) * take)
      .limit(limit)
      .populate({ path: 'expenses', select: '-user -__v' });
  }

  async getUser(query: { ageFrom?: number; ageTo?: number; age?: number }) {
    const { ageFrom, ageTo, age } = query;

    if (age) {
      return await this.userModel.find({ age });
    }

    if (ageFrom && ageTo) {
      if (ageFrom > ageTo) {
        throw new BadRequestException('ageFrom cannot be greater than ageTo');
      }

      return await this.userModel.find({
        age: { $gte: ageFrom, $lte: ageTo },
      });
    }

    return await this.userModel.find();
  }

  async allUser() {
    const users = await this.userModel.find();

    return users.length;
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
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { expenses: expensesId } },
      { new: true },
    );

    if (!updatedUser) throw new NotFoundException('User not found');

    return updatedUser;
  }
}
