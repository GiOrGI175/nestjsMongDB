import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { QueryParamsPipe } from './pipes/query.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() queryParams: QueryParamsDto) {
    // console.log(queryParams);

    return this.usersService.findAll(queryParams).populate('expenses');
  }

  @Get('user-age')
  getUser(@Query(new QueryParamsPipe()) query: QueryParamsDto) {
    return this.usersService.getUser(query);
  }

  @Get('all-user')
  allUser() {
    return this.usersService.allUser();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
