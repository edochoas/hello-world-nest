import { Body, Controller, Get, HttpException, HttpStatus, Post, UseFilters, Param, ParseIntPipe, UsePipes, ValidationPipe, SetMetadata } from '@nestjs/common';
import { Cat } from 'src/interfaces/cat.interface';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { CreateCatDto } from 'src/dto/create-cat.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('cats')
export class CatsController {
    constructor(private catsService: CatsService) { }

    @Post()
    @Roles('admin')
    async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
        this.catsService.create(createCatDto);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
        return this.catsService.findOne(id);
    }

    @Get('dog')
    @UseFilters(HttpExceptionFilter)
    getDog() {
        // throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'This app only contains cats',
        }, HttpStatus.NOT_FOUND);
    }
}
