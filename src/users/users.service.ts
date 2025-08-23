import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid'
import { EmailService } from 'src/email/email.service';



@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService,
    private readonly EmailService: EmailService
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { password, confirmPassword, email, name } = createUserDto
    if (password != confirmPassword) {
      throw new BadRequestException("Password does not match")
    }
    const isExist = await this.findByEmail(email)
    if (isExist) {
      throw new ConflictException("User with this email already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const emailVerificationLink = uuidv4()
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newUser = await this.prismaService.users.create({
      data: {
        email,
        passwordHash: hashedPassword,
        isAdmin: true,
        name,
        emailVerificationToken: emailVerificationLink,
        emailVerificationExpiry
      }
    })
    try {
      await this.EmailService.sendMail(newUser)
    } catch (error) {
      console.log(`Error while sending an email ${error}`);
      throw new BadRequestException(`Error while sending an email ${error}`);
    }
    return {
      message: "Registeration is successfull, before login please check your email and verify!",
      user: newUser
    }
  }

  findAll() {
    return this.prismaService.users.findMany({
      select: {
        id: true,
        email: true,
        isActive: true,
        isAdmin: true,
        isVerified: true,
        name: true,
        username: true
      }
    })
  }

  findOne(id: string) {
    return this.prismaService.users.findUnique({ where: { id } })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isExist = await this.findOne(id)
    if (!isExist) {
      throw new NotFoundException("User not found")
    }
    return this.prismaService.users.update({
      where: { id },
      data: updateUserDto
    })
  }

  async remove(id: string) {
    const isExist = await this.findOne(id)
    if (!isExist) {
      throw new NotFoundException("User not found")
    }
    return this.prismaService.users.delete({
      where: { id }
    })
  }

  findByEmail(email: string) {
    return this.prismaService.users.findUnique({ where: { email } })
  }

  async activateLink(emailVerificationToken: string) {
    const user = await this.prismaService.users.findUnique({
      where: { emailVerificationToken }
    });

    if (!user) {
      throw new BadRequestException("Invalid link to verify");
    }

    if (user.isVerified) {
      throw new BadRequestException("Account already activated!");
    }

    const expiryDate = new Date(user.emailVerificationExpiry);
    const now = new Date();

    if (now > expiryDate) {
      throw new BadRequestException("The verification link has expired. Please request a new one.");
    }
    await this.prismaService.users.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationExpiry: null,
      }
    });
    return {
      message: "Verification is successful! Go back and login"
    };
  }

  async blockUser(id: string) {
    const user = this.findOne(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    await this.prismaService.users.update({
      where: { id },
      data: {
        isActive: false
      }
    })
    return {
      message: "User blocked successfully"
    }
  }
}
