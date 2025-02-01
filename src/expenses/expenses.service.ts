import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private ExpenseModel: Model<Expense>,
    private userService: UsersService,
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const user = await this.userService.findOne(userId);

    const newExpense = await this.ExpenseModel.create({
      ...createExpenseDto,
      user: user._id,
    });
    await this.userService.addexpense(user._id, newExpense._id);

    return newExpense;
  }

  findAll() {
    return this.ExpenseModel.find().populate({ path: 'user' });
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
