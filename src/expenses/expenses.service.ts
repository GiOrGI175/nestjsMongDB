import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { isValidObjectId, Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private ExpenseModel: Model<Expense>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException('user not found');

    const newExpense = await this.ExpenseModel.create({
      ...createExpenseDto,
      user: user._id,
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { expenses: newExpense._id },
    });

    return newExpense;
  }

  findAll() {
    return this.ExpenseModel.find().populate({
      path: 'user',
      select: '-expenses -_id -createdAt -__v',
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  async remove(userId, id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('ivalid id');

    const deleteExpense = await this.ExpenseModel.findByIdAndDelete(id);

    if (!deleteExpense) throw new NotFoundException('not found exp');

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: {
        expenses: deleteExpense._id,
      },
    });

    return deleteExpense;
  }
}
